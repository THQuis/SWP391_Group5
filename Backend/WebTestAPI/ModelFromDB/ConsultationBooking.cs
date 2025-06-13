using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("ConsultationBooking")]
public partial class ConsultationBooking
{
    [Key]
    [Column("BookingID")]
    public int BookingId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("CoachID")]
    public int CoachId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime BookingDate { get; set; }

    public int Duration { get; set; }

    [StringLength(50)]
    public string Status { get; set; } = null!;

    public string? MeetingLink { get; set; }

    public string? Notes { get; set; }

    public string? CoachNotes { get; set; }

    [StringLength(50)]
    public string? PreferredLanguage { get; set; }

    public bool? ReminderSent { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("CoachId")]
    [InverseProperty("ConsultationBookingCoaches")]
    public virtual User Coach { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("ConsultationBookingUsers")]
    public virtual User User { get; set; } = null!;
}
