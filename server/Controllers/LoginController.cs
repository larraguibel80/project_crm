using Microsoft.AspNetCore.Mvc;
using server;  // Assuming Database and Employee are in the 'server' namespace

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("login")]
    public class LoginController : ControllerBase
    {
        private readonly Database _database;  // Inject the Database class here

        // Constructor to inject the Database class
        public LoginController(Database database)
        {
            _database = database;  // Assign the injected Database instance
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Email and password are required.");
            }

            // Use the Database class to authenticate the user
            var user = _database.AuthenticateUser(loginRequest.Email, loginRequest.Password);

            // If user is null, return Unauthorized
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            // Return the user's role if authentication is successful
            return Ok(new { role = user.Role });
        }
    }

    // DTO for the login request body
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}