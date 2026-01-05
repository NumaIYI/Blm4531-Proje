using Hospital.Api.Models;
using System.Threading.Tasks;

namespace Hospital.Api.Services
{
    public interface IOneriAiService
    {
        Task<OneriAi?> GetRandomSuggestionAsync();
    }
}
