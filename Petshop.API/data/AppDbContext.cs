using Microsoft.EntityFrameworkCore;
using Petshop.API.Models;

namespace Petshop.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Client> Clients { get; set; }
    public DbSet<Pet> Pets { get; set; }
}
