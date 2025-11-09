namespace Hospital.Api.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string TCNo { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }

        public User User { get; set; } = null!;
        public ICollection<Visit> Visits { get; set; } = new List<Visit>();
    }
}