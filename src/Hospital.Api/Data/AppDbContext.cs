using Microsoft.EntityFrameworkCore;
using Hospital.Api.Models;
using System;
using System.Collections.Generic;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    
    public DbSet<User> Users { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Visit> Visits { get; set; }
    public DbSet<Prescription> Prescriptions { get; set; }
    public DbSet<OneriAi> OneriAis { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

      
        modelBuilder.Entity<Patient>()
            .HasMany(p => p.Visits)
            .WithOne(v => v.Patient)
            .HasForeignKey(v => v.PatientId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Visit>()
            .HasMany(v => v.Prescriptions)
            .WithOne(p => p.Visit)
            .HasForeignKey(p => p.VisitId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        
        modelBuilder.Entity<Patient>()
            .HasOne(p => p.User)
            .WithOne(u => u.Patient)
            .HasForeignKey<Patient>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        var fixedDate = DateTime.Parse("2025-10-01T10:00:00Z").ToUniversalTime();

       
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "doktor1",
                PasswordHash = "12345", 
                FullName = "Dr. Nehir ÇİFTÇİ",
                Role = "Doctor",
                CreatedAt = fixedDate
            }
        );

      
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 2,
                Username = "hasta1",
                PasswordHash = "12345", 
                FullName = "Mehmet Demir",
                Role = "Patient",
                CreatedAt = fixedDate
            }
        );

       
        modelBuilder.Entity<Patient>().HasData(
            new Patient
            {
                Id = 1,
                UserId = 2, 
                TCNo = "11111111111",
                BirthDate = new DateTime(1990, 5, 15),
                Address = "İstanbul",
                Phone = "5551234567"
            }
        );

        
        modelBuilder.Entity<Visit>().HasData(
            new Visit
            {
                Id = 1,
                PatientId = 1,
                Date = fixedDate.AddDays(-10), 
                Diagnosis = "Migren",
                Notes = "Hafif baş ağrısı şikayetiyle geldi."
            }
        );

     
        modelBuilder.Entity<Prescription>().HasData(
            new Prescription
            {
                Id = 1,
                VisitId = 1,
                Medication = "Parol",
                Dosage = "500mg",
                Instructions = "Günde 2 kez tok karnına",
                CreatedAt = fixedDate.AddDays(-10)
            }
        );

        
        
    }
}
