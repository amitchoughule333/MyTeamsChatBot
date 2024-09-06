using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Policy;

namespace MyTeamsChatBot.Controllers
{
    public class DownloadFileController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public DownloadFileController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFileAndDownloadExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected or the file is empty.");
            }

            // Send the file to the external API
            using (var httpClient = _httpClientFactory.CreateClient())
            {
                using (var formData = new MultipartFormDataContent())
                {
                    var fileContent = new StreamContent(file.OpenReadStream());
                    fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
                    formData.Add(fileContent, "file", file.FileName);

                    string apiUrl = _configuration.GetSection("ExtractInsightsAPI")["API"];
                    // Send the file to the external API
                    var response = await httpClient.PostAsync(apiUrl, formData);

                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response file
                        var responseStream = await response.Content.ReadAsStreamAsync();
                        var contentType = response.Content.Headers.ContentType.ToString();
                        var contentDisposition = response.Content.Headers.ContentDisposition;

                        return File(responseStream, contentType, contentDisposition?.FileName ?? "response.xlsx");
                    }
                    else
                    {
                        return StatusCode((int)response.StatusCode, response.ReasonPhrase);
                    }
                }
            }
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
