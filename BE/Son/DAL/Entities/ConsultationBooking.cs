using System;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class ConsultationBooking
    {
        [Key]
        public int BookingID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public int CoachID { get; set; }
        public User Coach { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public int Duration { get; set; } // phút

        [Required]
        [RegularExpression("Pending|Confirmed|Cancelled|Completed")]
        public string Status { get; set; }

        public string MeetingLink { get; set; }
        public string Notes { get; set; }
        public string CoachNotes { get; set; }

        [MaxLength(50)]
        public string PreferredLanguage { get; set; }

        public bool ReminderSent { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
