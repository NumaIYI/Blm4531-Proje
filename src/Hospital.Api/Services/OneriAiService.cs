using Hospital.Api.Data;
using Hospital.Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using System.Text.Json;
using System.Net.Http;

namespace Hospital.Api.Services
{
    public class OneriAiService : IOneriAiService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public OneriAiService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<string> GetOneriFromAiAsync(string diagnosis)
        {
            var apiKey = _configuration["Gemini:ApiKey"];
            
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

            var client = _httpClientFactory.CreateClient();

          
            var requestBody = new
            {
                contents = new[]
                {
                    new {
                        parts = new[] {
                            new { text = $"Sen bir hastane destek sistemisin. Muayene bilgisine göre olası benzer vakalara bakarak varsa en çok kullanılan ilaç adını ver sadece ilaç adını vermen yeterli {diagnosis}" }
                        }
                    }
                }
            };

            var jsonRequest = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await client.PostAsync(url, content);

            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(responseString);
                
                var aiResponse = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return aiResponse ?? "AI şu an yanıt üretemedi.";
            }

            return "Yapay zeka servisine şu an ulaşılamıyor.";
        }
    }
}
