namespace server;

public class Messages
{
    public int id { get; set; }
    public string message { get; set; }
    
    public string username { get; set; }
    public Messages(int id, string message, string username)
    {
        this.id = id;
        this.message = message;
        this.username = username;
    }
}