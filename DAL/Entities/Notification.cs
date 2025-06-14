namespace Smoking.DAL.Entities
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
    }
}
