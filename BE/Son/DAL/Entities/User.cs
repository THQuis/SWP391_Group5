﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.Metadata;

namespace Smoking.DAL.Entities
{
    [Table("User")]
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required, MaxLength(255)]
        public string FullName { get; set; } = null!;

        [Required, MaxLength(255)]
        public string Email { get; set; } = null!;

        [Required, MaxLength(255)]
        public string Password { get; set; } = null!;

        [MaxLength(15)]
        public string? PhoneNumber { get; set; }   // nullable

        public int? RoleID { get; set; }

        public Role? Role { get; set; }             // nullable

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        [Required, MaxLength(50)]
        public string Status { get; set; } = null!;

        public string? ProfilePicture { get; set; }  // nullable

        // Navigation collections initialized to avoid null reference
        public ICollection<UserMembership> UserMemberships { get; set; } = new List<UserMembership>();
        public ICollection<SmokingStatus> SmokingStatuses { get; set; } = new List<SmokingStatus>();
        public ICollection<QuitPlan> QuitPlans { get; set; } = new List<QuitPlan>();
        public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public ICollection<Blog> Blogs { get; set; } = new List<Blog>();
        public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
        public ICollection<ConsultationBooking> ConsultationBookingsAsUser { get; set; } = new List<ConsultationBooking>();
        public ICollection<ConsultationBooking> ConsultationBookingsAsCoach { get; set; } = new List<ConsultationBooking>();
    }

}
