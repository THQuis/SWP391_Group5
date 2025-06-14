namespace Smoking.API.Models.Notification
{
    public class NotificationRequest
    {
<<<<<<< HEAD
        public string Email { get; set; }
        public string Message { get; set; }
        public int RoleId { get; set; }
        public string NotificationType { get; set; } // System, Alert, Reminder, etc.
        public string NotificationName { get; set; } // Tên thông báo
        public string Condition { get; set; } // Trạng thái như "Pending", "Processed", "Sent"
        public string NotificationFor { get; set; } // "All Users", "Role", etc.
        public string CreatedBy { get; set; } // "Admin", "System", etc.
=======
        public string Email { get; set; } // Email người nhận (có thể rỗng nếu gửi cho tất cả người dùng)
        public string Message { get; set; } // Nội dung thông báo
        public int RoleId { get; set; }    // RoleId (2: User, 3: Coach)
>>>>>>> 0883082cd4d76433817b1141a26c07978d461828
    }
}
