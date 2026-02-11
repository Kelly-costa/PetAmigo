using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Petshop.API.Data;
using Petshop.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Petshop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PetsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PetsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pet>>> Get()
        {
            var pets = await _context.Pets
                .Include(p => p.Client)
                .ToListAsync();

            return Ok(pets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pet>> GetById(int id)
        {
            var pet = await _context.Pets
                .Include(p => p.Client)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pet == null)
                return NotFound();

            return Ok(pet);
        }

        [HttpPost]
        [HttpPost]
        public async Task<ActionResult> Create(Pet pet)
        {
            var client = await _context.Clients.FindAsync(pet.ClientId);
            if (client == null)
                return BadRequest("Cliente não encontrado");

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = pet.Id }, pet);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Pet updatedPet)
        {
            var pet = await _context.Pets.FindAsync(id);
            if (pet == null)
                return NotFound();

            pet.Name = updatedPet.Name;
            pet.Type = updatedPet.Type;
            pet.ClientId = updatedPet.ClientId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var pet = await _context.Pets.FindAsync(id);

            if (pet == null)
                return NotFound();

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
