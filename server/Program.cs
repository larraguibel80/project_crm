using System.Data;
using Npgsql;
using server;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<EmailService>();


var app = builder.Build();

Database database = new Database();
NpgsqlDataSource db = database.Connection();


app.MapGet("/api", () => "Hello World!");

//Forms part

//Gets all forms from database.
app.MapGet("/api/formlist", () => GetForms());

//Sends all forms to database, and an automation mail will come to your email with a link to chat.
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
    <a href='http://localhost:4000/chat/{token}'>Join Chat</a>

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

//Adds forms in database, including a token that is unique for each chat.
async Task AddForm(string email, string service_product, string message, Guid token)
{
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(service_product)  || string.IsNullOrWhiteSpace(message))
    {
        Console.WriteLine("Cannot send with empty information");
        return;
    }
    await using var cmd =
        db.CreateCommand("INSERT INTO forms (email, service_product, message, token) VALUES (@email, @service_product, @message, @token) RETURNING id");
        
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@service_product", service_product);
    cmd.Parameters.AddWithValue("@message", message);
    cmd.Parameters.AddWithValue("@token", token);

    int formId;
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        if (await reader.ReadAsync())
        {
            formId = reader.GetInt32(0);
        }
        else
        {
            Console.WriteLine("Fail");
            return;
        }
    }

    await using var cmd2 = db.CreateCommand("INSERT INTO service_list (form_id, agent_id) VALUES (@form_id, NULL)");
    cmd2.Parameters.AddWithValue("@form_id", formId);
    await cmd2.ExecuteNonQueryAsync();

}

//Agents part

//Gets all agents from database.
app.MapGet("/api/agents", async () => await AgentsList.GetAllAgents(db));

//Inserts agent to database, the agent will get a welcoming email, with the oppurtonity to change their password.
app.MapPost("/api/agents", async (AgentsList agent, EmailService emailService) =>
{
    await AddAgent(agent.Firstname, agent.Lastname, agent.Email, agent.Password);
    var subject = "New Form Submission";
    
    // Creating the email body with a link (this is the "Join Chat" link part)
    var body = $@"
    Hello {agent.Email},

    Welcome to this CRM system! 
    Your current password is: {agent.Password}

    If you want to change your password, click the link below:
    <a href='http://localhost:4000/changepassword'>Change Password</a>

    Best regards,
    CRM Team";

    // Send the email
    emailService.SendEmail(agent.Email, subject, body);

    return Results.Ok(new { message = "Form has been saved and email sent"});
});

//Adds agent in database, you have to fill in your firstname, lastname, email and password.
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

// Correct the delete route here.
app.MapDelete("/api/agents/{id}", async (int id) =>
{
    await DeleteAgent(id);
    return Results.Ok(new { message = "Agent has been deleted" });
});

// Deletes an agent.
async Task DeleteAgent(int id)
{
    await using var cmd = db.CreateCommand("UPDATE agents SET is_deleted = true, deleted_at = NOW() WHERE id = @id");
    cmd.Parameters.AddWithValue("@id", id);
    await cmd.ExecuteNonQueryAsync();
}

//Updates an agents credentials.
app.MapPut("/api/agents/{id}", async (int id, AgentsList updatedAgent) =>
{
    await UpdateAgent(id, updatedAgent.Firstname, updatedAgent.Lastname, updatedAgent.Email, updatedAgent.Password);
    return Results.Ok(new { message = "Agent has been updated" });
});

//Updates
async Task UpdateAgent(int id, string firstname, string lastname, string email, string password)
{
    if (string.IsNullOrWhiteSpace(firstname) || string.IsNullOrWhiteSpace(lastname) || 
        string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
        Console.WriteLine("All fields are required");
        return;
    }
    await using var cmd =
        db.CreateCommand("UPDATE agents SET firstname = @firstname, lastname = @lastname, email = @email, password = @password WHERE id = @id");

    cmd.Parameters.AddWithValue("@id", id);
    cmd.Parameters.AddWithValue("@firstname", firstname);
    cmd.Parameters.AddWithValue("@lastname", lastname);
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@password", password);

    await cmd.ExecuteNonQueryAsync();
}

//ServiceList part, this is a list that joins forms table with agent table.
app.MapGet("/api/service_list", () => GetList());

async Task<List<ServiceList>> GetList()
{
    var service = new List<ServiceList>();
    await using var cmd = db.CreateCommand("SELECT service_list.id, service_list.form_id, service_list.agent_id, forms.email AS form_email, forms.service_product, forms.message, forms.created, agents.email AS agent_email FROM service_list INNER JOIN forms ON service_list.form_id = forms.id LEFT JOIN agents ON service_list.agent_id = agents.id  ");
    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        while (await reader.ReadAsync())
        {
            service.Add(new ServiceList(
                reader.GetInt32(0),
                reader.GetInt32(1),
                reader.IsDBNull(2) ? (int?)null : reader.GetInt32(2),
                reader.GetString(3),
                reader.GetString(4),
                reader.GetString(5),
                reader.GetDateTime(6),
                reader.IsDBNull(7) ? string.Empty : reader.GetString(7)
            ));
        
        } return service;
    }
}

//You can delete a service.
async Task DeleteList(int id)
{
    await using var cmd = db.CreateCommand("DELETE FROM service_list WHERE id = @id");
    cmd.Parameters.AddWithValue("@id", id);
    await cmd.ExecuteNonQueryAsync();
}
app.MapDelete("/api/service_list/{id}", async (int id) =>
{
    await DeleteList(id);
    return Results.Ok(new { message = "Tjänst has been deleted" });
});

//Chat part

//Inserts messages från chat in database. Every message is connected to token and form id.
app.MapPost("/api/chat/{token}", async (string token,Messages message) =>
{
    await AddMessage(message.message, message.username, token);
    return Results.Ok(new {  message.message, message.username, token });
});
app.MapGet("/api/messages/{token}", (string token) => GetMessages(token));

// Add messages
async Task AddMessage(string message, string username, string token)
{
    
    await using var cmd =
        db.CreateCommand("INSERT INTO chat (message, username, form_id ,token) VALUES (@message,@username, (SELECT id FROM forms WHERE token = @token),@token)");
    
    cmd.Parameters.AddWithValue("@message", message);
    cmd.Parameters.AddWithValue("@username", username);
    cmd.Parameters.AddWithValue("@token", token);

    await cmd.ExecuteNonQueryAsync();
}

//Gets messages
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

//Updates your password, when you write existing email.
app.MapPut("/api/agents/password", async (UpdatePassword request) =>
{
    if (string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.newPassword))
    {
        return Results.BadRequest(new { message = "Fyll i email och ditt nya lösenord" });
    }

    var update = await UpdatePassword(request.email, request.newPassword);
    
    if (!update)
    {
        return Results.NotFound();
    }
    return Results.Ok(new { message = "You changed your password!"});
});

async Task<bool> UpdatePassword(string email, string newPassword)
{
    await using var cmd = db.CreateCommand("UPDATE agents SET password = @password WHERE  email = @email");
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@password", newPassword);
   
    var rowsAffected = await cmd.ExecuteNonQueryAsync();
    return rowsAffected > 0;
}


// Updated: Login endpoint
app.MapPost("/api/login", async (LoginRequest loginRequest) =>
{
    try
    {
        bool isAuthenticated = await AuthenticateUser(loginRequest.Email, loginRequest.Password, loginRequest.Role);
        if (isAuthenticated)
        {
            return Results.Ok(new { message = "Login successful" });
        }
        else
        {
            return Results.BadRequest(new { message = "Invalid email, password, or role" });
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
        return Results.Json(new { message = ex.Message }, statusCode: 500);
    }
});

async Task<bool> AuthenticateUser(string email, string password, string role)
{
    string query = string.Empty;
    
    // Determine query based on role (case-insensitive)
    if (role.Equals("Admin", StringComparison.OrdinalIgnoreCase))
    {
        query = "SELECT * FROM admins WHERE email = @email AND password = @password";
    }
    else if (role.Equals("Agent", StringComparison.OrdinalIgnoreCase))
    {
        query = "SELECT * FROM agents WHERE email = @email AND password = @password AND is_deleted = false";
    }
    else
    {
        return false;  // Invalid role
    }

    // Execute the query
    await using var cmd = db.CreateCommand(query);
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@password", password);

    await using (var reader = await cmd.ExecuteReaderAsync())
    {
        return await reader.ReadAsync();  // If a row is returned, credentials are correct
    }
}
app.Run();