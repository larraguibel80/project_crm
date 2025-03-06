using Microsoft.AspNetCore.Mvc;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("login")]
    public class LoginController : ControllerBase
    {
        [HttpPost]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null || string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
            {
                return BadRequest("Email and password are required.");
            }

            // Dummy user validation (replace with actual logic)
            var user = ValidateUser(loginRequest.Email, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }

            return Ok(new { role = user.Role });  // Send the role back on successful login
        }

        private User ValidateUser(string email, string password)
        {
            // Example validation - replace with real database/authentication logic
            if (email == "test@example.com" && password == "password123")
            {
                return new User { Role = "admin" };
            }
            return null;
        }
    }

    // DTO for the login request body
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    // A basic User class (you can expand this with more details)
    public class User
    {
        public string Role { get; set; }
    }
}