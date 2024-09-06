using Microsoft.AspNetCore.Mvc;

namespace MyTeamsChatBot.Controllers
{
    public class AzureBotController : Controller
    {
        private readonly IConfiguration _configuration;
        public AzureBotController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [Route("api/GetChatResponseAsync")]
        [HttpGet]
        public async Task<IActionResult> GetChatResponseAsync(string question)
        {
            using (var client = new HttpClient())
            {
                // Encode the chatMessage to be URL-safe
                //string encodedMessage = Uri.EscapeDataString(chatMessage);
                string url = _configuration.GetSection("AWSChatbotAPI")["API"];

                // Construct the endpoint URL with the encoded chatMessage
                string endpoint = url + $"{question}";

                var request = new HttpRequestMessage(HttpMethod.Get, endpoint);

                try
                {
                    var response = await client.SendAsync(request);

                    // Ensure the response indicates success
                    response.EnsureSuccessStatusCode();

                    // Read the response content as a string
                    var responseContent = await response.Content.ReadAsStringAsync();

                    // Return the response content
                    return Ok(responseContent);
                }
                catch (HttpRequestException ex)
                {
                    
                    return StatusCode(500, $"Request error: {ex.Message}");
                }
            }
        }

        public IActionResult Index()
        {
            return View();
        }
    }
}
