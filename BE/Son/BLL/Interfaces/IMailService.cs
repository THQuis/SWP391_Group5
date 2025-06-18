using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IMailService
    {
        Task SendOtpEmailAsync(string toEmail, string otpCode); // Gửi email OTP
        Task SendHtmlEmailAsync(string toEmail, string subject, string htmlBody); // Gửi email HTML (Dùng cho các email có định dạng HTML)
        Task SendEmailAsync(string toEmail, string subject, string body); // Gửi email cơ bản (văn bản thuần)
    }
}
