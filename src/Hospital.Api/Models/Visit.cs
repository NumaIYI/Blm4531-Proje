namespace Hospital.Api.Models
{
    public class Visit
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        //  public int DoctorId { get; set; }
        // public DateTime VisitDate { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        //public string Diagnosis { get; set; }
        //public string Notes { get; set; }

        public Patient Patient { get; set; } = null!;
        //public User Doctor { get; set; }
        public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
    }
}