using Npgsql;
using server;

var builder = WebApplication.CreateBuilder(args);

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// Add your services before calling Build()
builder.Services.AddSingleton<EmailService>(); // Move this line up here

var app = builder.Build();

app.UseCors("AllowAll");

// Other code remains the same...

Database database = new Database();
NpgsqlDataSource db = database.Connection();

/*app.UseCors(policy =>
    policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
);*/

app.MapGet("/api", () => "Hello World!");
app.MapGet("/api/formlist", () => GetForms());

app.MapPost("/api/forms", async (Form form, EmailService emailService) =>
{
    // Insert form into the database
    await AddForm(form.email, form.service_product, form.message);

    // Prepare email subject and body
    var subject = "New Form Submission";
    
    // Creating the email body with a link (this is the "Join Chat" link part)
    var body = $@"
Hello {form.email},

Thank you for your submission! 

To join the chat, click the link below:
<a href='http://your-app-url.com/chat/{form.email}'>Join Chat</a>

Best regards,
CRM Team";

    // Send the email
    emailService.SendEmail(form.email, subject, body);

    return Results.Ok(new { message = "Form has been saved and email sent" });
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
                reader.GetInt32(0),  // ID
                reader.GetString(1),  // Email
                reader.GetString(2),  // Product/Service
                reader.GetString(3)   // Message
            ));
        }
    }

    // Log for debugging
    Console.WriteLine(forms.Count > 0 ? forms[0].ToString() : "No forms found.");

    return forms;  // Return the list of forms
}

async Task AddForm(string email, string service_product, string message)
{
    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(service_product)  || string.IsNullOrWhiteSpace(message))
    {
        Console.WriteLine("Cannot send with empty information");
        return;
    }
    await using var cmd =
        db.CreateCommand("INSERT INTO forms (email, service_product, message) VALUES (@email, @service_product, @message)");
        
    cmd.Parameters.AddWithValue("@email", email);
    cmd.Parameters.AddWithValue("@service_product", service_product);
    cmd.Parameters.AddWithValue("@message", message);

    await cmd.ExecuteNonQueryAsync();
}

app.Run();
