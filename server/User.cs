// The User class should look something like this
public class User
{
    public int Id { get; set; }  // This is the 'Id' property.
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; } // ⚠️ Plaintext password, should be hashed!
    public string Role { get; set; }
}