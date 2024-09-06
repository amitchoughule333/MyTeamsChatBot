namespace MyTeamsChatBot.Models
{
    public class ChatMessage
    {
        public string question { get; set; }
        public List<ChatHistoryMessage> chat_history { get; set; }
    }

    public class ChatHistory
    {
        public List<ChatHistoryMessage> chatHistory { get; set; } = new List<ChatHistoryMessage>();
    }

    public class ChatHistoryMessage
    {
        public string role { get; set; }
        public string content { get; set; }
    }

    public class ChatMessageResponse
    {
        public string answer { get; set; }
    }
}
