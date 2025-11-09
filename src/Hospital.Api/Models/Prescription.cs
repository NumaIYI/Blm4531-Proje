namespace Hospital.Api.Models
{
    public class Prescription

    {
        public int Id { get; set; }
        public int VisitId { get; set; }
        public string Medication { get; set; } = null!;
        public string Dosage { get; set; } = null!;
        public string Instructions { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Visit Visit { get; set; } = null!;
    }
}