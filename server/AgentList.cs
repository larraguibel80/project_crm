using Npgsql;

namespace server
{
    public class AgentsList
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }


        // Constructor
        public AgentsList(int id, string firstname, string lastname, string email, string password)
        {
            Id = id;
            Firstname = firstname;
            Lastname = lastname;
            Email = email;
            Password = password;
        }

// Method to get all agents from the database
        public static async Task<List<AgentsList>> GetAllAgents(NpgsqlDataSource db)
        {
            var agents = new List<AgentsList>();
            await using var cmd = db.CreateCommand("SELECT * FROM agents WHERE is_deleted = false");
            await using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    agents.Add(new AgentsList(
                        reader.GetInt32(0), // Id
                        reader.GetString(1), // Firstname
                        reader.GetString(2), // Lastname
                        reader.GetString(3), // Email
                        reader.GetString(4) // Password
                    ));
                }
            }

            return agents;
        }
    }
}