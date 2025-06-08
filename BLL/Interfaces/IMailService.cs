namespace Smoking.BLL.Interfaces
{
    public interface IMailService
    {
        Task SendOtpEmailAsync(string toEmail, string otpCode);
    }
}
