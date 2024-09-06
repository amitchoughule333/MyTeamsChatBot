//using Azure;
//using Azure.AI.OpenAI;
//using MyTeamsChatBot.Models;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Graph;
//using Microsoft.Graph.Models;
//using System.Diagnostics;
//using System.Threading;

//namespace MyTeamsChatBot.Controllers
//{
//    public class ChatController : Controller
//    {
//        private readonly string endpoint = "https://aiprotos2882524221.openai.azure.com/";
//        private readonly string key = "53dbbe159fe9443a997419c6b0b4f6d7";
//        private readonly string model = "gpt-4-GP";

//        public IActionResult Index()
//        {
//            return View();
//        }

//        [HttpPost]
//        public async Task<IActionResult> GetResponse(string userMessage)
//        {
//            OpenAIClient client = new OpenAIClient(new Uri(endpoint),new AzureKeyCredential(key));
//            var chatCompletionsOptions = new ChatCompletionsOptions()
//            {
//                Messages =
//                {
//                    new ChatRequestUserMessage(userMessage)
//                },
//                MaxTokens = 800,
//                DeploymentName = model,
//                Temperature = (float)0.7,
//                NucleusSamplingFactor = (float)0.95,
//                FrequencyPenalty = 0,
//                PresencePenalty = 0,
//            };
            
//            Response<ChatCompletions> response = await client.GetChatCompletionsAsync(chatCompletionsOptions);

//            var botResponse = response.Value.Choices.First().Message.Content;

//            return Json(new { Response  = botResponse });
//        }


//    }
//}
