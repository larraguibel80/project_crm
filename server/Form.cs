namespace server;

public class Form
{
    public int id { get; set; }
    
    public string email { get; set; }
    public string service_product { get; set; }
    public string message { get; set; }
    public DateTime created { get; set; }
    
   
   
    

    public Form(int id, string email, string service_product,string message, DateTime created)
    {
        this.id = id;
        this.email = email;
        this.service_product = service_product;
        this.message= message;
        this.created= created;
    }
}