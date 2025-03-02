using Npgsql;
using server;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<EmailService>();


var app = builder.Build();

Database database = new Database();
NpgsqlDataSource db = database.Connection();


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
<a href='http://localhost:5179/chat/{token}'>Join Chat</a>

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
        db.CreateCommand("INSERT INTO chat (message, username, token) VALUES (@message,@username, @token)");
    
    cmd.Parameters.AddWithValue("@message", message);
    cmd.Parameters.AddWithValue("@username", username);
    cmd.Parameters.AddWithValue("@token", token);

    await cmd.ExecuteNonQueryAsync();
}


async Task<List<Messages>> GetMessages(string token)
{
    var messages = new List<Messages>();
    await using var cmd = db.CreateCommand("SELECT * FROM chat WHERE token = @token");
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

app.Run();