namespace server;
using Npgsql;
public class Database
{
    
    private readonly string _host = "localhost";
    private readonly string _port = "5432";
    private readonly string _username = "postgres";
    private readonly string _password = "PutaVerga9!"; // root OR postgres
    private readonly string _database = "postgres";
    private NpgsqlDataSource _connection;
    
    public Database()
    {
        var connectionString = $"Host={_host};Port={_port};Username={_username};Password={_password};Database={_database}";
        _connection = NpgsqlDataSource.Create(connectionString);
    }
    public NpgsqlDataSource Connection()
    {
        return _connection;
    }
    
    public Employee? AuthenticateUser(string email, string password)
    {
        using var conn = _connection.OpenConnection();
        using var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT id, first_name, last_name, email, role FROM employees WHERE email = @Email AND password = @Password";
        cmd.Parameters.AddWithValue("Email", email);
        cmd.Parameters.AddWithValue("Password", password);

        using var reader = cmd.ExecuteReader();
        if (reader.Read()) // Found a match
        {
            return new Employee(
                reader.GetInt32(0),  // id
                reader.GetString(1), // first_name
                reader.GetString(2), // last_name
                reader.GetString(3), // email
                reader.GetString(4)  // role
            );
        }
        return null; // No match found
    }

}