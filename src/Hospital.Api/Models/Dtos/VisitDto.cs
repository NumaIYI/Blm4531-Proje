using System;
using System.Collections.Generic;

namespace Hospital.Api.Models.Dtos
{
    public class VisitDto
    {
        public int Id { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public List<PrescriptionDto>? Prescriptions { get; set; }
    }
}