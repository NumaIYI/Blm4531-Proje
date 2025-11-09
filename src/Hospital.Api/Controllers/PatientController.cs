using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hospital.Api.Data;
using Hospital.Api.Models;
using Hospital.Api.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hospital.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PatientsController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Visits)
                    .ThenInclude(v => v.Prescriptions)
                .Select(p => new PatientDto
                {
                    Id = p.Id,
                    Name = p.User.FullName,
                    TCNo = p.TCNo,
                    Phone = p.Phone,
                    Address = p.Address,
                    Gender = p.User.Role,
                    Age = p.BirthDate.HasValue ? DateTime.Now.Year - p.BirthDate.Value.Year : 0,
                    User = new UserDto
                    {
                        Username = p.User.Username,
                        FullName = p.User.FullName
                    },
                    Visits = p.Visits.Select(v => new VisitDto
                    {
                        Date = v.Date,
                        Prescriptions = v.Prescriptions.Select(pr => new PrescriptionDto
                        {
                            Id = pr.Id,
                            Medication = pr.Medication,
                            Dosage = pr.Dosage,
                            Instructions = pr.Instructions
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return Ok(patients);
        }

        
        [HttpPost]
        public async Task<IActionResult> AddPatient([FromBody] Patient patient)
        {
            
            _context.Users.Add(patient.User);
            await _context.SaveChangesAsync();

            patient.UserId = patient.User.Id;

            var visit = new Visit
            {
                Patient = patient,
                Date = DateTime.UtcNow,
                Prescriptions = new List<Prescription>
                {
                    new Prescription
                    {
                        Medication = "Paracetamol",
                        Dosage = "500mg",
                        Instructions = "Günde 2 kez"
                    }
                }
            };
            patient.Visits = new List<Visit> { visit };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            
            var createdPatient = new PatientDto
            {
                Id = patient.Id,
                Name = patient.User.FullName,
                TCNo = patient.TCNo,
                Phone = patient.Phone,
                Address = patient.Address,
                Gender = patient.User.Role,
                Age = patient.BirthDate.HasValue ? DateTime.Now.Year - patient.BirthDate.Value.Year : 0,
                User = new UserDto
                {
                    Username = patient.User.Username,
                    FullName = patient.User.FullName
                },
                Visits = patient.Visits.Select(v => new VisitDto
                {
                    Date = v.Date,
                    Prescriptions = v.Prescriptions.Select(pr => new PrescriptionDto
                    {
                        Id = pr.Id,
                        Medication = pr.Medication,
                        Dosage = pr.Dosage,
                        Instructions = pr.Instructions
                    }).ToList()
                }).ToList()
            };

            return CreatedAtAction(nameof(GetAllPatients), new { id = patient.Id }, createdPatient);
        }
    }
}
