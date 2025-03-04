namespace server;

public class UpdatePassword
{
    
    public string email { get; set; }
    public string newPassword { get; set; }
    
    

    public UpdatePassword(string email, string newPassword)
    {
        this.email = email;
        this.newPassword = newPassword;
        
    }
}