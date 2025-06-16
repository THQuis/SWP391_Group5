namespace Smoking.API.Models.Admin
{
    public class SendNotificationRequest
    {
        public bool ToAllUsers { get; set; }
        public string ToRole { get; set; }
        public string Email { get; set; }

        public int NotificationID { get; set; }
        public int UserID { get; set; }
        public string Message { get; set; }
        public DateTime NotificationDate { get; set; }
        public string NotificationType { get; set; }
        public DateTime SentAt { get; set; }
        public string NotificationName { get; set; }
        public string Condition { get; set; }
        public string NotificationFor { get; set; }
        public string CreatedBy { get; set; }

    }
}
