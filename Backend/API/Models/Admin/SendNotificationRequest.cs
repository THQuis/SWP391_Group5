namespace Smoking.API.Models.Admin
{
    public class SendNotificationRequest
    {
        public string Message { get; set; } = null!;
        public int? RoleID { get; set; }           // Optional
        public string? Email { get; set; }         // Optional
    }
}
