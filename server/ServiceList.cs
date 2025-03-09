namespace server;

public class ServiceList
{
    public int id { get; set; }
    public int form_id { get; set; }
    public int? agent_id { get; set; }
    public string form_email { get; set; }
    public string service_product { get; set; }
    public string message { get; set; }
    public DateTime created { get; set; }
    public string? agent_email { get; set; }


    public ServiceList(int id, int form_id, int? agent_id, string form_email, string service_product,
        string message, DateTime created, string? agent_email)
    {
        this.id = id;
        this.form_id = form_id;
        this.agent_id = agent_id;
        this.form_email = form_email;
        this.service_product = service_product;
        this.message = message;
        this.created = created;
        this.agent_email = agent_email;
    }
}
    