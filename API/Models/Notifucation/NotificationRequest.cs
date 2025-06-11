namespace Smoking.API.Models.Notification
{
    public class NotificationRequest
    {
        public string Email { get; set; } // Email người nhận (có thể rỗng nếu gửi cho tất cả người dùng)
        public string Message { get; set; } // Nội dung thông báo
        public int RoleId { get; set; }    // RoleId (2: User, 3: Coach)
    }
}
