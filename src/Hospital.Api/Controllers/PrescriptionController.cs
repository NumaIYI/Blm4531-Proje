using Microsoft.AspNetCore.Mvc;
using Hospital.Api.Data;
using Hospital.Api.Models;
using System.Threading.Tasks;
using Hospital.Api.Models.Dtos;

namespace Hospital.Api.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class PrescriptionsController : ControllerBase
	{
		private readonly AppDbContext _context;

		public PrescriptionsController(AppDbContext context)
		{
			_context = context;
		}
	

		[HttpPut("{id}")]
		public async Task<IActionResult> UpdatePrescription(int id, [FromBody] PrescriptionDto updatedDto)
		{
			var prescription = await _context.Prescriptions.FindAsync(id);
			if (prescription == null)
				return NotFound();

			
			prescription.Medication = updatedDto.Medication;
			prescription.Dosage = updatedDto.Dosage;
			prescription.Instructions = updatedDto.Instructions;

			await _context.SaveChangesAsync();

			return Ok(new PrescriptionDto
			{
				Id = prescription.Id,      
				Medication = prescription.Medication,
				Dosage = prescription.Dosage,
				Instructions = prescription.Instructions
			});

		}


	}
}

