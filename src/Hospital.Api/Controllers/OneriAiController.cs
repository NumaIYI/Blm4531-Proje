using Hospital.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Hospital.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OneriAiController : ControllerBase
    {
        private readonly IOneriAiService _oneriAiService;

        public OneriAiController(IOneriAiService oneriAiService)
        {
            _oneriAiService = oneriAiService;
        }

        [HttpGet("ai")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetRandomSuggestion()
        {
            var suggestion = await _oneriAiService.GetRandomSuggestionAsync();
            if (suggestion == null)
            {
                return NotFound("No suggestions available.");
            }
            return Ok(suggestion);
        }
    }
}
