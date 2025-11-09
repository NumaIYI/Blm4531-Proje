namespace Hospital.Api.Models.Dtos
{
    public class PrescriptionDto
    {
        public int Id { get; set; }
        public string Medication { get; set; }
        public string Dosage { get; set; }
        public string Instructions { get; set; }
    }
}