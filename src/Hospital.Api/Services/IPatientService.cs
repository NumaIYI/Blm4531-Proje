using Hospital.Api.Models;
using Hospital.Api.Models.Dtos;

namespace Hospital.Api.Services
{
    public interface IPatientService
    {
   
        Task<IEnumerable<PatientDto>> GetAllPatientsAsync();

        Task<PatientDto> GetPatientByIdAsync(int id);

    
        Task<PatientDto> AddPatientAsync(Patient patientModel, int age);
        Task<PatientDto?> UpdatePatientAsync(int id, PatientDto patientUpdateDto);
        Task<bool> DeletePatientAsync(int id);
        
        Task<PatientDto> GetPatientByUserIdAsync(int userId);
    }
}