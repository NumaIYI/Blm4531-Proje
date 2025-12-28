using Microsoft.AspNetCore.Mvc;
using Hospital.Api.Models;
using Hospital.Api.Models.Dtos;
using Hospital.Api.Services;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Hospital.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        
        [HttpGet]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();

            if (patients == null || !patients.Any())
            {
                return NotFound("Hiç hasta bulunamadı.");
            }
            return Ok(patients);
        }

        
        [HttpGet("{id}")]
        [Authorize(Roles = "Doctor,Patient")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patient = await _patientService.GetPatientByIdAsync(id);
            if (patient == null)
            {
                return NotFound();
            }
            return Ok(patient);
        }

        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddPatient([FromBody] Patient patientRequest)
        {
            int age = 0; 
            var createdPatient = await _patientService.AddPatientAsync(patientRequest, age);
            return CreatedAtAction(nameof(GetPatient), new { id = createdPatient.Id }, createdPatient);
        }

        
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            bool isDeleted = await _patientService.DeletePatientAsync(id);
            if (!isDeleted)
            {
                return NotFound("Silinecek hasta bulunamadı.");
            }
            return NoContent();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] PatientDto patientUpdateDto)
        {
            var updatedPatient = await _patientService.UpdatePatientAsync(id, patientUpdateDto);
            if (updatedPatient == null)
            {
                return NotFound("Güncellenecek hasta bulunamadı.");
            }
            return Ok(updatedPatient);
        }

      
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetPatientByUserId(int userId)
        {
            
            var claimsUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (claimsUserId == null || int.Parse(claimsUserId) != userId)
            {
                return Forbid();
            }

            var patient = await _patientService.GetPatientByUserIdAsync(userId);
            if (patient == null)
            {
                return NotFound("Bu kullanıcıya ait bir hasta kaydı bulunamadı.");
            }
            return Ok(patient);
        }
    }
}
