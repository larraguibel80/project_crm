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
app.MapPost("/api/forms", async (Form form) =>
{
    await AddForm(form.email, form.service_product, form.message);
    return Results.Ok(new { message = "Form has been saved" });
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