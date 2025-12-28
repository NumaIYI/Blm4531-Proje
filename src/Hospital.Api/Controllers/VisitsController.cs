using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Hospital.Api.Data;
using Hospital.Api.Models;
using Hospital.Api.Models.Dtos;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Hospital.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VisitsController(AppDbContext context)
        {
            _context = context;
        }

 
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateVisitDetails(int id, [FromBody] VisitDto visitDto)
        {
           
            var visitToUpdate = await _context.Visits
                .Include(v => v.Prescriptions)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (visitToUpdate == null)
            {
                return NotFound("Güncellenecek ziyaret kaydı bulunamadı.");
            }

        
            visitToUpdate.Diagnosis = visitDto.Diagnosis;
            visitToUpdate.Notes = visitDto.Notes;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Visits.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent(); 
        }
    }
}