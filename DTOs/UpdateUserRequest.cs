namespace WebTestAPI.DTOs
{
    public class UpdateUserRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int RoleId { get; set; }
        public int PackageId { get; set; }
        public string Status { get; set; }
    }
}
