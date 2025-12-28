using Hospital.Api.Models.Dtos;

namespace Hospital.Api.Services
{
    public interface IUserService
    {
        Task<AuthResponseDto?> AuthenticateAsync(LoginRequestDto request);
    }
}