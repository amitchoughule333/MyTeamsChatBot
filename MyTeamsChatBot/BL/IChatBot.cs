namespace MyTeamsChatBot.BL
{
    public interface IChatBot
    {
        public string FetchAIResponse(AIendpoint_config pConfig, string pChatMessage);

    }
}
