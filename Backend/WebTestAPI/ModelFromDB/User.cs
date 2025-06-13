using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("User")]
[Index("Email", Name = "UQ__User__A9D10534F9F56AD1", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("UserID")]
    public int UserId { get; set; }

    [StringLength(255)]
    public string FullName { get; set; } = null!;

    [StringLength(255)]
    public string Email { get; set; } = null!;

    [StringLength(255)]
    public string Password { get; set; } = null!;

    [StringLength(15)]
    public string? PhoneNumber { get; set; }

    [Column("RoleID")]
    public int? RoleId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? RegistrationDate { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public string? ProfilePicture { get; set; }

    [InverseProperty("Author")]
    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();

    [InverseProperty("Coach")]
    public virtual ICollection<ConsultationBooking> ConsultationBookingCoaches { get; set; } = new List<ConsultationBooking>();

    [InverseProperty("User")]
    public virtual ICollection<ConsultationBooking> ConsultationBookingUsers { get; set; } = new List<ConsultationBooking>();

    [InverseProperty("User")]
    public virtual ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();

    [InverseProperty("User")]
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    [InverseProperty("User")]
    public virtual ICollection<QuitPlan> QuitPlans { get; set; } = new List<QuitPlan>();

    [ForeignKey("RoleId")]
    [InverseProperty("Users")]
    public virtual Role? Role { get; set; }

    [InverseProperty("User")]
    public virtual ICollection<SmokingStatus> SmokingStatuses { get; set; } = new List<SmokingStatus>();

    [InverseProperty("User")]
    public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();

    [InverseProperty("User")]
    public virtual ICollection<UserMembership> UserMemberships { get; set; } = new List<UserMembership>();
}