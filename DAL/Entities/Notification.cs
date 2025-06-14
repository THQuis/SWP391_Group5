<<<<<<< HEAD
﻿namespace Smoking.DAL.Entities
{
    public class Notification
    {
        public int NotificationID { get; set; }  // Primary Key
        public int UserID { get; set; }  // FK to User
        public string Message { get; set; }
        public DateTime NotificationDate { get; set; }  // Time the notification is created
        public string NotificationType { get; set; }  // e.g., "System", "Alert"
        public DateTime SentAt { get; set; }  // Time the notification was sent
        public string NotificationName { get; set; }
        public string Condition { get; set; }  // e.g., "Pending", "Sent"
        public string NotificationFor { get; set; }  // e.g., "All Users", "Role"
        public string CreatedBy { get; set; }  // e.g., "Admin", "System"
=======
﻿using System;
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
>>>>>>> 0883082cd4d76433817b1141a26c07978d461828
    }
}
