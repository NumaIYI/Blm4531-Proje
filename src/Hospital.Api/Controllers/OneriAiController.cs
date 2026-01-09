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
    
        [HttpPost("analiz-et")]
        public async Task<IActionResult> AnalizEt([FromBody] string diagnosis)
        {
            if (string.IsNullOrEmpty(diagnosis)) return BadRequest("Tanı boş olamaz.");
    
            var sonuc = await _oneriAiService.GetOneriFromAiAsync(notlar);
            return Ok(new { oneri = sonuc });
        }
    }
}
