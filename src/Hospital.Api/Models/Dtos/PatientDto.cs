using System;
using System.Collections.Generic;

namespace Hospital.Api.Models.Dtos
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string TCNo { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; }
        public UserDto User { get; set; }
        public List<VisitDto> Visits { get; set; }
    }
}