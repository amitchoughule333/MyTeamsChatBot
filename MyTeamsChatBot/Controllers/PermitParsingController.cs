using Microsoft.AspNetCore.Mvc;
using Azure.AI.OpenAI;
using Azure;
using System.Text.Json;
using System.Reflection.Metadata.Ecma335;
using MyTeamsChatBot.BL;

namespace MyTeamsChatBot.Controllers
{
    public class PermitParsingController : Controller
    {
        private readonly ChatService _service;
        private readonly IConfiguration _configuration;
        private readonly IChatBot _chatBot;

        public PermitParsingController(ChatService service, IConfiguration configuration, IChatBot chatBot)
        {
            _service = service;
            _configuration = configuration;
            _chatBot = chatBot;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public object FetchDocumentResponse(string chatMessage)
        {
            AIendpoint_config config = new AIendpoint_config();

            config.AzureOpenAIEndpoint = _configuration.GetSection("AzureOpenAI")["AZURE_OPENAI_ENDPOINT"];
            config.AzureOpenAIKey = _configuration.GetSection("AzureOpenAI")["AZURE_OPENAI_API_KEY"];
            config.DeploymentName = _configuration.GetSection("AzureOpenAI")["AZURE_OPENAI_DEPLOYMENT_ID"];
            config.SearchEndpoint = _configuration.GetSection("AzureOpenAI")["AZURE_AI_SEARCH_ENDPOINT"];
            config.SearchKey = _configuration.GetSection("AzureOpenAI")["AZURE_AI_SEARCH_API_KEY"];
            config.SearchIndex = _configuration.GetSection("AzureOpenAI")["AZURE_AI_SEARCH_INDEX"];

            try
            {
                return _chatBot.FetchAIResponse(config, chatMessage.Trim());
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "Server error. Please try again later.";
            }
        }
    }
    
}
