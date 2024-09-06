using Azure.Storage.Blobs;
using MyTeamsChatBot.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System.Diagnostics;
using Azure.Search.Documents.Indexes;
using Azure;

namespace MyTeamsChatBot.Controllers
{
    public class FileuploadController : Controller
    {
       
        private static string tileType;

        private readonly ChatService _service;
        private readonly IConfiguration _configuration;

       

        public FileuploadController(ChatService service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
        }

        public IActionResult Index(string screenType)
        {
            tileType = screenType;
            return View("Index", tileType);
        }
        private AIendpoint_config InitializeParameters(string screenType)
        {
            AIendpoint_config config = new AIendpoint_config();

            if (screenType == "permit-parsing")
            {
                config.SearchEndpoint = _configuration.GetSection("AzureOpenAI")["AZURE_AI_SEARCH_ENDPOINT"];
                config.SearchKey = _configuration.GetSection("AzureOpenAI")["AZURE_AI_SEARCH_API_KEY"];
                config.SearchIndex = _configuration.GetSection("AzureOpenAI")["AZURE_AI_SEARCH_INDEX"];
                config.ConnectionString = _configuration.GetSection("AzureOpenAI")["AZURE_AI_BLOB_CONNECTION_STRING"];
                config.ContainerName = _configuration.GetSection("AzureOpenAI")["AZURE_AI_BLOB_CONTAINER_NAME"];
            
            }
            else if (screenType == "permit-comparision")
            {
                config.SearchEndpoint = _configuration.GetSection("AzurePermitComparison")["AZURE_AI_SEARCH_ENDPOINT"];
                config.SearchKey = _configuration.GetSection("AzurePermitComparison")["AZURE_AI_SEARCH_API_KEY"];
                config.SearchIndex = _configuration.GetSection("AzurePermitComparison")["AZURE_AI_SEARCH_INDEX"];
                config.ConnectionString = _configuration.GetSection("AzurePermitComparison")["AZURE_AI_BLOB_CONNECTION_STRING"];
                config.ContainerName = _configuration.GetSection("AzurePermitComparison")["AZURE_AI_BLOB_CONTAINER_NAME"];
            }
            else
            {
                throw new ArgumentException("Invalid screenType.");
            }
           return config;
        }

        [HttpPost]
        public async Task<IActionResult>UploadFileToBlob(IFormFile file)
        {
            
            if (file == null || file.Length == 0)
            {
                //ViewBag.Message = "No file selected.";
                //return View();
            }
            AIendpoint_config config = InitializeParameters(tileType);
            try
            {
               
                var blobServiceClient = new BlobServiceClient(config.ConnectionString);
                var blobContainerClient = blobServiceClient.GetBlobContainerClient(config.ContainerName);

                var blobClient = blobContainerClient.GetBlobClient(file.FileName);
                using (var stream = file.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, true);
                }

                //ViewBag.Message = "File uploaded successfully.";
            }
            catch (Exception ex)
            {
                //ViewBag.Message = $"An error occurred: {ex.Message}";
                Console.WriteLine(ex.ToString());
            }

               //runIndexer to refresh files index
            runIndexer(config.SearchIndex, config.SearchEndpoint, config.SearchKey);

            return Ok(new { message = "File uploaded successfully." });
        }

        [HttpGet]
        public async Task<IActionResult>FetchBlobStorageFiles()
        {
            AIendpoint_config config = InitializeParameters(tileType);
            List<string> fileNames = new List<string>();

            try
            {
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(config.ConnectionString);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = blobClient.GetContainerReference(config.ContainerName);

                BlobContinuationToken continuationToken = null;
                do
                {
                    var resultSegment = await container.ListBlobsSegmentedAsync(null, true, BlobListingDetails.None, null, continuationToken, null, null);
                    foreach (IListBlobItem item in resultSegment.Results)
                    {
                        if (item is CloudBlockBlob blob)
                        {
                            fileNames.Add(blob.Name);
                        }
                    }
                    continuationToken = resultSegment.ContinuationToken;
                } while (continuationToken != null);
            }
            catch (Exception ex)
            {
                // Handle exceptions
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
            //ViewBag.Files = fileNames;
            //Console.WriteLine(fileNames);
            return Ok(fileNames);
        }

        private void runIndexer(string indexerName, string searchEndpoint, string searchkey)
        {
            AIendpoint_config config = InitializeParameters(tileType);
            try
            {
                var searchCredential = new AzureKeyCredential(config.SearchKey);
                SearchIndexerClient searchIndexerClient = new SearchIndexerClient(new Uri(searchEndpoint), searchCredential);
                searchIndexerClient.RunIndexer(indexerName);
                Console.WriteLine("Indexer Updated Successfully!");
            }
            catch (RequestFailedException ex) when (ex.Status == 429)
            {
                Console.WriteLine("Failed to run indexer: {0}", ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBlobStorageFiles(string fileName)
        {
            AIendpoint_config config = InitializeParameters(tileType);
            try
            {
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(config.ConnectionString);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = blobClient.GetContainerReference(config.ContainerName);

                CloudBlockBlob blob = container.GetBlockBlobReference(fileName);

                await CreateBlankFileonLocal(fileName);

                await blob.DeleteIfExistsAsync();

                ViewBag.Message = "File deleted successfully.";
            }
            catch (Exception ex)
            {
                ViewBag.Message = $"An error occurred: {ex.Message}";
            }

            runIndexer(config.SearchIndex, config.SearchEndpoint, config.SearchKey);

            // Redirect back to Index action after deletion
            return Ok();
        }

        public async Task CreateBlankFileonLocal(string fileName)
        {
            string localFolderPath = "D:\\AI_Project_Latest_fromPawan\\Azure_congnitiveAPI_POC27032024\\Azure_congnitiveAPI_POC27032024\\Azure_CognitiveAPI_POC\\Duplicate-container";

            try
            {
                var localFilePath = Path.Combine(localFolderPath, fileName);
             
                using (var fileStream = System.IO.File.Create(localFilePath))
                {
                    
                }
                await UploadBlankFileToBlob(fileName, localFilePath);
                System.IO.File.Delete(localFilePath);

                Console.WriteLine("Blank File named " + fileName + " successfully created at " + localFilePath);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while creating the blank file: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task UploadBlankFileToBlob(string fileName, string localFilePath)
        {
            AIendpoint_config config = InitializeParameters(tileType);
            try
            {
                var blobServiceClient = new BlobServiceClient(config.ConnectionString);
                var blobContainerClient = blobServiceClient.GetBlobContainerClient(config.ContainerName);

                var blobClient = blobContainerClient.GetBlobClient(fileName);
                using (var stream = System.IO.File.OpenRead(localFilePath))
                {
                    await blobClient.UploadAsync(stream, true);
                }

                runIndexer(config.SearchIndex, config.SearchEndpoint, config.SearchKey);
                Console.WriteLine("Blank File named " + fileName + " uploaded successfully to Blob Storage.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while uploading blank file to Blob Storage: {ex.Message}");
            }
        }
    }
}
