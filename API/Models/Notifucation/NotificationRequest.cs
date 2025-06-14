namespace Smoking.API.Models.Notification
{
    public class NotificationRequest
    {
        public string Email { get; set; }
        public string Message { get; set; }
        public int RoleId { get; set; }
        public string NotificationType { get; set; } // System, Alert, Reminder, etc.
        public string NotificationName { get; set; } // Tên thông báo
        public string Condition { get; set; } // Trạng thái như "Pending", "Processed", "Sent"
        public string NotificationFor { get; set; } // "All Users", "Role", etc.
        public string CreatedBy { get; set; } // "Admin", "System", etc.
    }
}
