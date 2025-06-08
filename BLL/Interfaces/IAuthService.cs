using Smoking.DAL.Entities;

public interface IAuthService
{
    Task RegisterTempAsync(string fullName, string email, string password, string phoneNumber);
    Task<bool> VerifyOtpAndRegisterAsync(string email, string otpCode);
    Task<User> AuthenticateAsync(string email, string password);
}
