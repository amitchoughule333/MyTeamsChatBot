using Azure.AI.OpenAI;
using Azure;
using Microsoft.Graph.Models;
using System.Text.Json;

namespace MyTeamsChatBot.BL
{
    public class ChatBot:IChatBot
    {
        public string FetchAIResponse(AIendpoint_config pConfig, string pChatMessage)
        {
            try
            {
                var client = new OpenAIClient(new Uri(pConfig.AzureOpenAIEndpoint), new AzureKeyCredential(pConfig.AzureOpenAIKey));

                var chatCompletionsOptions = new ChatCompletionsOptions()
                {
                    Messages =
                    {
                        new ChatRequestUserMessage("You are an assistant to provide information in HTML format based on  " +
                        "the context given below. Do not include citations: \r\n"
                        + pChatMessage),
                    },
                        AzureExtensionsOptions = new AzureChatExtensionsOptions()
                        {
                            Extensions =
                            {
                                new AzureCognitiveSearchChatExtensionConfiguration()
                                {
                                    SearchEndpoint = new Uri(pConfig.SearchEndpoint),
                                    Key = pConfig.SearchKey,
                                    IndexName = pConfig.SearchIndex,
                                },
                            }
                    
                        },
                        DeploymentName = pConfig.DeploymentName
                };

                Response<ChatCompletions> response = client.GetChatCompletions(chatCompletionsOptions);

                ChatResponseMessage responseMessage = response.Value.Choices[0].Message;

                Console.WriteLine($"Message from {responseMessage.Role}:");
                Console.WriteLine("===");
                Console.WriteLine(responseMessage.Content);
                Console.WriteLine("===");

                Console.WriteLine($"Context information (e.g. citations) from chat extensions:");
                Console.WriteLine("===");
                string contextContent = "";

                foreach (ChatResponseMessage contextMessage in responseMessage.AzureExtensionsContext.Messages)
                {
                    contextContent = contextMessage.Content;
                    try
                    {
                        var contextMessageJson = JsonDocument.Parse(contextMessage.Content);
                        contextContent = JsonSerializer.Serialize(contextMessageJson, new JsonSerializerOptions()
                        {
                            WriteIndented = true,
                        });
                    }
                    catch (JsonException)
                    { }
                    Console.WriteLine($"{contextMessage.Role}: {contextContent}");
                }
                Console.WriteLine("===");

                return responseMessage.Content.Replace(" an HTML ", " ").Replace(" HTML ", " ");
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
