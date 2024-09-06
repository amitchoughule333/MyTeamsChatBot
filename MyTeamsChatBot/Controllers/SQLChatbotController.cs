using MyTeamsChatBot.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace MyTeamsChatBot.Controllers
{
    public class SQLChatbotController : Controller
    {
        private readonly IConfiguration _configuration;

        public SQLChatbotController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        [Route("api/FetchSQLResponse")]
        public async Task<IActionResult> FetchSQLResponse([FromBody] string chatMessage)
        {
            if (string.IsNullOrEmpty(chatMessage))
            {
                return BadRequest("Invalid request. 'chatMessage' parameter is required.");
            }

            // Define the API endpoint URL
            string apiUrl = _configuration.GetSection("SQLChatbotAPI")["API"];

            // Create the request body as a JSON object
            var requestBody = new
            {
                question = chatMessage
            };

            var jsonRequestBody = JsonConvert.SerializeObject(requestBody);

            try
            {
                using (var httpClient = new HttpClient())
                {
                    // Serialize the request body to JSON
                    var jsonContent = new StringContent(jsonRequestBody, Encoding.UTF8, "application/json");

                    // Make the POST request to the external API
                    var response = await httpClient.PostAsync(apiUrl, jsonContent);

                    // Check if the response is successful
                    if (!response.IsSuccessStatusCode)
                    {
                        return StatusCode((int)response.StatusCode, "Error processing the request.");
                    }

                    // Read the response content as a string
                    var responseContent = await response.Content.ReadAsStringAsync();

                    // Return the response content
                    return Ok(responseContent);
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that occur during the API request
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
