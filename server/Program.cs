using Npgsql;
using server;


var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddCors();

var app = builder.Build();

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
                reader.GetString(3)
                
            ));
        }
    }
    Console.WriteLine(forms[0]);
    return forms;
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