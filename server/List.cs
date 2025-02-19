using Npgsql;

namespace server
{
    public class List
    {
        public int Id { get; set; }
        public int Clients_id { get; set; }
        public int Users_id { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public string Priority { get; set; }

        // Constructor
        public List(int id, int clients_id, int users_id, string subject, string message, string status, string priority)
        {
            Id = id;
            Clients_id = clients_id;
            Users_id = users_id;
            Subject = subject;
            Message = message;
            Status = status;
            Priority = priority;
        }

        // Method to get all agents from the database
        public static async Task<List<List>> GetAlllist(NpgsqlDataSource db)
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
                }
            }
            return agents;
        }
    }
}