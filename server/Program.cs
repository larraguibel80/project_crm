using System.Data;
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
<a href='http://localhost:4001/chat/{token}'>Join Chat</a>

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

app.MapGet("/api/agents", async () => await AgentsList.GetAllAgents(db));

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
<a href='http://localhost:4001/changepassword'>Change Password</a>

Best regards,
CRM Team";

    // Send the email
    emailService.SendEmail(agent.Email, subject, body);

    return Results.Ok(new { message = "Form has been saved and email sent"});
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
app.MapPut("/api/agents/password", async (UpdatePassword request) =>
{
    if (string.IsNullOrWhiteSpace(request.email) || string.IsNullOrWhiteSpace(request.newPassword))
    {
        return Results.BadRequest(new { message = "Fyll i email och ditt nya lösenord" });
    }
    await UpdatePassword(request.email, request.newPassword);
    return Results.Ok(new { message = "You changed your password!"});
});

async Task UpdatePassword(string email, string newPassword)
{
    await using var cmd = db.CreateCommand("UPDATE agents SET password = @password WHERE  email = @email");
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@password", newPassword);
    await cmd.ExecuteReaderAsync();
}

app.Run();