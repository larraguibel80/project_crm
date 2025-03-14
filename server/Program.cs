using Npgsql;
using server;
using YourNamespace.Controllers;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<Database>();  // Register Database as a Singleton
builder.Services.AddHttpContextAccessor(); // Add IHttpContextAccessor
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add authorization services
builder.Services.AddAuthorization();

// Add CORS policy
/*builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});*/

// Add controllers
builder.Services.AddControllers(); // Add this line to fix the error


var app = builder.Build();

Database database = new Database();
NpgsqlDataSource db = database.Connection();
app.UseCors("AllowFrontend");
app.UseSession();



// Manually allow CORS for your React frontend
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:5174");
    context.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    context.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (context.Request.Method == "OPTIONS") 
    {
        context.Response.StatusCode = 200;
        return;
    }

    await next();
});

app.UseAuthorization(); // If using authentication
app.MapControllers();   // If using controllers


app.MapGet("/api", () => "Hello World!");
app.MapGet("/api/formlist", () => GetForms());

app.MapPost("/api/forms", async (Form form, EmailService emailService) =>
{
    var token = Guid.NewGuid();
    
    // Insert form into the database
    await AddForm(form.email, form.service_product, form.message, token);

    // Prepare email subject and body
    var subject = "New Form Submission";
    
    // Creating the email body with a link (this is the "Join Chat" link part)
    var body = $@"
Hello {form.email},

Thank you for your submission! 

To join the chat, click the link below:
<a href='http://localhost:5184/chat/{token}'>Join Chat</a>

Best regards,
CRM Team";

    // Send the email
    emailService.SendEmail(form.email, subject, body);

    return Results.Ok(new { message = "Form has been saved and email sent", token });
});

// Function to retrieve forms from the database
async Task<List<Form>> GetForms()
{
    var forms = new List<Form>();

    await using var cmd = db.CreateCommand("SELECT * FROM forms");
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            forms.Add(new Form(
                reader.GetInt32(0),  
                reader.GetString(1), 
                reader.GetString(2),  
                reader.GetString(3),
                reader.GetDateTime(4),
                reader.GetString(5)
            ));
        }
    }
    
    Console.WriteLine(forms.Count > 0 ? forms[0].ToString() : "No forms found.");

    return forms;  // Return the list of forms
}

async Task AddForm(string email, string service_product, string message, Guid token)
{
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(service_product)  || string.IsNullOrWhiteSpace(message))
    {
        Console.WriteLine("Cannot send with empty information");
        return;
    }
    await using var cmd =
        db.CreateCommand("INSERT INTO forms (email, service_product, message, token) VALUES (@email, @service_product, @message, @token)");
        
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@service_product", service_product);
    cmd.Parameters.AddWithValue("@message", message);
    cmd.Parameters.AddWithValue("@token", token);

    await cmd.ExecuteNonQueryAsync();
}

app.MapGet("/api/agents", async () => await AgentsList.GetAllAgents(db));

app.MapPost("/api/agents", async (AgentsList agent) =>
{
    await AddAgent(agent.Firstname, agent.Lastname, agent.Email, agent.Password);
    return Results.Ok(new { message = "Agent has been added" });
});

async Task AddAgent(string firstname, string lastname, string email, string password)
{
    if (string.IsNullOrWhiteSpace(firstname) || string.IsNullOrWhiteSpace(lastname) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
        Console.WriteLine("All fields are required");
        return;
    }
    await using var cmd =
        db.CreateCommand("INSERT INTO agents (firstname, lastname, email, password) VALUES (@firstname, @lastname, @email, @password)");

    cmd.Parameters.AddWithValue("@firstname", firstname);
    cmd.Parameters.AddWithValue("@lastname", lastname);
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@password", password);

    await cmd.ExecuteNonQueryAsync();
}

// Correct the delete route here
app.MapDelete("/api/agents/{id}", async (int id) =>
{
    await DeleteAgent(id);
    return Results.Ok(new { message = "Agent has been deleted" });
});

async Task DeleteAgent(int id)
{
    await using var cmd = db.CreateCommand("DELETE FROM agents WHERE id = @id");
    cmd.Parameters.AddWithValue("@id", id);
    await cmd.ExecuteNonQueryAsync();
}

app.MapGet("/api/list", () => GetList());

async Task<List<List>> GetList()
{
    var agents = new List<List>();
    await using var cmd = db.CreateCommand("SELECT * FROM list");
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            agents.Add(new List(
                reader.GetInt32(0),  // Id
                reader.GetInt32(1),  // Clients_id
                reader.GetInt32(2),  // Users_id
                reader.GetString(3),  // Subject
                reader.GetString(4),  // Message
                reader.GetString(5),  // Status
                reader.GetString(6)   // Priority
            ));
        
        } return agents;
    }
}

async Task DeleteList(int id)
{
    await using var cmd = db.CreateCommand("DELETE FROM list WHERE id = @id");
    cmd.Parameters.AddWithValue("@id", id);
    await cmd.ExecuteNonQueryAsync();
}
app.MapDelete("/api/list/{id}", async (int id) =>
{
    await DeleteList(id);
    return Results.Ok(new { message = "Tjänst has been deleted" });
});


app.MapPost("/api/chat/{token}", async (string token,Messages message) =>
{
    await AddMessage(message.message, message.username, token);
    return Results.Ok(new {  message.message, message.username, token });
});
app.MapGet("/api/messages/{token}", (string token) => GetMessages(token));

async Task AddMessage(string message, string username, string token)
{
    
    await using var cmd =
        db.CreateCommand("INSERT INTO chat (message, username, form_id ,token) VALUES (@message,@username, (SELECT id FROM forms WHERE token = @token),@token)");
    
    cmd.Parameters.AddWithValue("@message", message);
    cmd.Parameters.AddWithValue("@username", username);
    cmd.Parameters.AddWithValue("@token", token);

    await cmd.ExecuteNonQueryAsync();
}


async Task<List<Messages>> GetMessages(string token)
{
    var messages = new List<Messages>();
    await using var cmd = db.CreateCommand("SELECT * FROM chat WHERE form_id = (SELECT id FROM forms WHERE token = @token)");
    cmd.Parameters.AddWithValue("@token", token);
    
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            messages.Add(new Messages(
                reader.GetInt32(0),
                reader.GetString(1),
                reader.GetString(2),
                reader.GetString(3)
                
            ));
        }
    }
    return messages;
}

// ✅ Function to get user from the database
// Function to get a user from the database
static User? GetUserFromDatabase(string email, string password)
{
    using var conn = new NpgsqlConnection("your_connection_string_here");
    conn.Open();

    using var cmd = new NpgsqlCommand("SELECT * FROM employees WHERE email = @Email AND password = @Password", conn);
    cmd.Parameters.AddWithValue("@Email", email);
    cmd.Parameters.AddWithValue("@Password", password);

    using var reader = cmd.ExecuteReader();
    return reader.Read() ? new User
    {
        Id = reader.GetInt32(0),          // Assuming the ID is the first column in the database
        FirstName = reader.GetString(1),
        LastName = reader.GetString(2),
        Email = reader.GetString(3),
        Password = reader.GetString(4),
        Role = reader.GetString(5)
    } : null;
}


/*app.MapPost("/login", async (HttpContext context) =>
{
    context.Response.Headers.Append("Access-Control-Allow-Origin", "http://localhost:5173");
    context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");

    if (!context.Request.HasFormContentType)
    {
        return Results.BadRequest(new { message = "Invalid content type. Expected form data." });
    }

    var form = await context.Request.ReadFormAsync();
    var email = form["email"];
    var password = form["password"];

    var user = GetUserFromDatabase(email, password);
    
    if (user == null)
    {
        return Results.Json(new { message = "Access Denied: Please log in." }, statusCode: 401);
    }

    context.Session.SetString("userRole", user.Role);
    return Results.Json(new { message = "Login successful!" });
});*/


app.Run();