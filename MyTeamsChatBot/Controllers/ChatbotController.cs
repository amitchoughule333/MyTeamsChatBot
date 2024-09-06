using DinkToPdf;
using DinkToPdf.Contracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using Newtonsoft.Json;
using OfficeOpenXml;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.Text;
using MyTeamsChatBot.Models;
using System.Net.Http;
using System.Net.Http.Headers;

namespace MyTeamsChatBot.Controllers
{
    public class ChatbotController : Controller
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ChatbotController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("api/FetchDocumentResponse")]
        public async Task<IActionResult> FetchDocumentResponse([FromBody] Models.ChatMessage chatMessage)
        {
            if (string.IsNullOrEmpty(chatMessage.question))
            {
                return BadRequest("Invalid request. 'chatMessage' parameter is required.");
            }

            // Retrieve the chat history from session using the session key
            //var sessionChatHistory = HttpContext.Session.GetString("test-chatbot");

            var chatHistory = GetObjectFromSession(HttpContext, "test-chatbot") ?? new List<ChatHistoryMessage>();


            // Add the current question to the chat history
            //chatHistory.Add(new ChatHistoryMessage
            //{
            //    Role = "user",
            //    Content = chatMessage.question
            //});

            // Create the request body with the updated chat history
            var requestBody = new Models.ChatMessage
            {
                question = chatMessage.question,
                chat_history = chatHistory
            };

            var hs = JsonConvert.SerializeObject(requestBody);

            try
            {
                using (var httpClient = new HttpClient())
                {
                    // Serialize the request body to JSON
                    var jsonContent = new StringContent(hs, Encoding.UTF8, "application/json");

                    string apiURL = _configuration.GetSection("ChatbotAPI")["API"];
                    
                    var response = await httpClient.PostAsJsonAsync(apiURL, requestBody);

                    // Check if the response is successful
                    if (!response.IsSuccessStatusCode)
                    {
                        return StatusCode((int)response.StatusCode, "Error processing the request.");
                    }

                    // Read the response content
                    var responseContent = await response.Content.ReadAsAsync<ChatMessageResponse>();

                    var userMessage = new ChatHistoryMessage
                    {
                        role = "user",
                        content = chatMessage.question
                    };

                    SaveObjectToSession(HttpContext, "test-chatbot", userMessage);

                    // Add the response to the chat history
                    var systemMessage = new ChatHistoryMessage
                    {
                        role = "system",
                        content = responseContent.answer
                    };

                    // Save the updated chat history back to the session
                    SaveObjectToSession(HttpContext, "test-chatbot", systemMessage);



                    // Return the response content
                    return Ok(responseContent.answer);
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the API request
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        public List<ChatHistoryMessage>? SaveObjectToSession(HttpContext context, string key, ChatHistoryMessage chatMessage)
        {
            string? jsonString = context.Session.GetString(key);

            List<ChatHistoryMessage> saveObj;
            var sessionHistory = GetObjectFromSession(context, key);

            if (sessionHistory != null)
            {
                saveObj = sessionHistory.Append(chatMessage).ToList();
            }
            else
            {
                saveObj = new List<ChatHistoryMessage>();
                saveObj.Append(chatMessage);
            }

            // Serialize the object to a JSON string
            jsonString = JsonConvert.SerializeObject(saveObj); // or JsonConvert.SerializeObject(obj) if using Newtonsoft.Json

            // Save the JSON string to the session
            context.Session.SetString(key, jsonString);

            return GetObjectFromSession(context, key);
        }

        public List<ChatHistoryMessage>? GetObjectFromSession(HttpContext context, string key)
        {
            var jsonString = context.Session.GetString(key);
            List<ChatHistoryMessage> retVal = new List<ChatHistoryMessage>();

            if (!string.IsNullOrEmpty(jsonString))
            {
                retVal = JsonConvert.DeserializeObject<List<ChatHistoryMessage>>(jsonString);// or JsonConvert.SerializeObject(obj) if using Newtonsoft.Json
            }

            return retVal;
        }

        [HttpPost]
        [Route("api/UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file selected or the file is empty.");
            }

            try
            {
                using (var httpClient = _httpClientFactory.CreateClient())
                {
                    using (var formData = new MultipartFormDataContent())
                    {
                        var fileContent = new StreamContent(file.OpenReadStream());
                        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType);
                        formData.Add(fileContent, "file", file.FileName);

                        string apiUrl = _configuration.GetSection("IngestAPI")["API"];
                        var response = await httpClient.PostAsync(apiUrl, formData);

                        if (response.IsSuccessStatusCode)
                        {
                            var responseStream = await response.Content.ReadAsStreamAsync();
                            var contentType = response.Content.Headers.ContentType.ToString();
                            var contentDisposition = response.Content.Headers.ContentDisposition;

                            using (var memoryStream = new MemoryStream())
                            {
                                await responseStream.CopyToAsync(memoryStream);
                                var fileData = memoryStream.ToArray();
                                var fileName = contentDisposition?.FileName ?? "response.xlsx";

                                return Ok(new { fileData, contentType, fileName });
                            }
                        }
                        else
                        {
                            // Log the response status and reason
                            var errorDetails = await response.Content.ReadAsStringAsync();
                            return StatusCode((int)response.StatusCode, $"Error from external API: {response.ReasonPhrase} - {errorDetails}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception message for debugging
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        public IActionResult Index()
        {
            return View();
        }

    }
}
