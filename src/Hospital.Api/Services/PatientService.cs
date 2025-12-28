using Hospital.Api.Data;
using Hospital.Api.Models;
using Hospital.Api.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Hospital.Api.Services
{
    public class PatientService : IPatientService
    {
        private readonly AppDbContext _context;

        public PatientService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PatientDto>> GetAllPatientsAsync()
        {
            var patients = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Visits)
                    .ThenInclude(v => v.Prescriptions)
                .ToListAsync();

            return patients.Select(MapToPatientDto);
        }

        public async Task<PatientDto> GetPatientByIdAsync(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Visits)
                    .ThenInclude(v => v.Prescriptions)
                .FirstOrDefaultAsync(p => p.Id == id);

            return patient == null ? null : MapToPatientDto(patient);
        }

        public async Task<PatientDto> GetPatientByUserIdAsync(int userId)
        {
            var patient = await _context.Patients
                .Include(p => p.User)
                .Include(p => p.Visits)
                    .ThenInclude(v => v.Prescriptions)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            return patient == null ? null : MapToPatientDto(patient);
        }

        public async Task<PatientDto> AddPatientAsync(Patient patientModel, int age)
        {
            patientModel.User.Role = "Patient";
            patientModel.User.PasswordHash = patientModel.User.PasswordHash; 
            _context.Users.Add(patientModel.User);
            await _context.SaveChangesAsync();

            patientModel.UserId = patientModel.User.Id;
            patientModel.BirthDate = System.DateTime.UtcNow.AddYears(-age);

            var initialVisit = new Visit
            {
                Date = System.DateTime.UtcNow,
                Diagnosis = "Initial Registration",
                Notes = "First entry during patient creation.",
                Prescriptions = new System.Collections.Generic.List<Prescription>
                {
                    new Prescription
                    {
                        Medication = "Lütfen ilaç girin",
                        Dosage = "Lütfen doz girin",
                        Instructions = "Lütfen talimat girin",
                        CreatedAt = System.DateTime.UtcNow
                    }
                }
            };

            patientModel.Visits.Add(initialVisit);
            _context.Patients.Add(patientModel);
            await _context.SaveChangesAsync();

            return MapToPatientDto(patientModel);
        }

        private PatientDto MapToPatientDto(Patient p)
        {
            return new PatientDto
            {
                Id = p.Id,
                Name = p.User.FullName,
                TCNo = p.TCNo,
                Phone = p.Phone,
                Address = p.Address,
                Gender = "Unknown/TBD",
                Age = p.BirthDate.HasValue ? System.DateTime.Now.Year - p.BirthDate.Value.Year : 0,
                User = new UserDto
                {
                    Username = p.User.Username,
                    FullName = p.User.FullName
                },
                Visits = p.Visits.Select(v => new VisitDto
                {
                    Id = v.Id, 
                    Date = v.Date,
                    Diagnosis = v.Diagnosis,
                    Notes = v.Notes,
                    Prescriptions = v.Prescriptions.Select(pr => new PrescriptionDto
                    {
                        Id = pr.Id,
                        Medication = pr.Medication,
                        Dosage = pr.Dosage,
                        Instructions = pr.Instructions
                    }).ToList()
                }).ToList()
            };
        }

        public Task<PatientDto?> UpdatePatientAsync(int id, PatientDto patientUpdateDto)
        {
            return Task.FromResult<PatientDto?>(null);
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            var patientToDelete = await _context.Patients.FindAsync(id);

            if (patientToDelete == null)
            {
                return false;
            }

            _context.Patients.Remove(patientToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}