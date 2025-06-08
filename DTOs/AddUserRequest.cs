using System.ComponentModel.DataAnnotations;

public class AddUserRequest
{
    [Required]
    public string FullName { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    [Phone]
    public string PhoneNumber { get; set; }

    [Required]
    public int RoleId { get; set; }

    [Required]
    public int PackageId { get; set; }

    [Required]
    public string Status { get; set; }
}
