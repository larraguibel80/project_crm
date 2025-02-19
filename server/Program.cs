using Npgsql;
using server;


var builder = WebApplication.CreateBuilder(args);



var app = builder.Build();

Database database = new Database();
NpgsqlDataSource db = database.Connection();


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


app.Run();