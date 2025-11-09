using System;
using System.Collections.Generic;

namespace Hospital.Api.Models.Dtos
{
    public class VisitDto
    {
        public DateTime Date { get; set; }
        public List<PrescriptionDto> Prescriptions { get; set; }
    }
}