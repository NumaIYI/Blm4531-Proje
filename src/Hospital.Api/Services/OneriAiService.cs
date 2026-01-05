using Hospital.Api.Data;
using Hospital.Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Hospital.Api.Services
{
    public class OneriAiService : IOneriAiService
    {
        private readonly AppDbContext _context;

        public OneriAiService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<OneriAi?> GetRandomSuggestionAsync()
        {
            var count = await _context.OneriAis.CountAsync();
            if (count == 0)
            {
                return null;
            }

            var random = new Random();
            var index = random.Next(count);
            return await _context.OneriAis.Skip(index).FirstOrDefaultAsync();
        }
    }
}
