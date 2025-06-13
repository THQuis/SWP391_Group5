using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    [Table("Notification")]
    public class Notification
    {
        [Key]
        public int NotificationID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime NotificationDate { get; set; } = DateTime.Now;

        [Required, MaxLength(50)]
        public string NotificationType { get; set; }
    }
}
