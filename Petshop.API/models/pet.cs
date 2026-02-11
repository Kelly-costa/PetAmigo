namespace Petshop.API.Models
{
    public class Pet
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public int ClientId { get; set; }

        public Client? Client { get; set; }
    }
}
