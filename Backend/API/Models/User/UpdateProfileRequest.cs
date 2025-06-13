namespace Smoking.API.Models.User
{
    public class UpdateProfileRequest
    {
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfilePicture { get; set; }
    }
}
