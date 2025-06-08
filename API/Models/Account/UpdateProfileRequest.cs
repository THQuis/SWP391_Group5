namespace Smoking.API.Models.Account
{
    public class UpdateProfileRequest
    {
        public string Email { get; set; } // Xác định user
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfilePicture { get; set; } // URL hoặc Base64
    }
}
