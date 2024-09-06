namespace MyTeamsChatBot
{
    public class ChatService
    {
        private readonly IConfiguration _configuration;

        private readonly string systemMessage = "You are an AI assistant that helps people find information about Sports.  " +
            "For anything other than Sports, respond with 'I can only answer questions about Sports.'";

        public ChatService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
    }
}
