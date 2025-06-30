using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IMailService
    {
<<<<<<< HEAD
        Task SendOtpEmailAsync(string toEmail, string otpCode); // Cũ
        Task SendHtmlEmailAsync(string toEmail, string subject, string htmlBody); // NEW → dùng cho Quên mật khẩu
        Task SendEmailAsync(string toEmail, string subject, string body); // Để gửi email cơ bản

=======
        Task SendOtpEmailAsync(string toEmail, string otpCode); 
        Task SendHtmlEmailAsync(string toEmail, string subject, string htmlBody);
        Task SendEmailAsync(string toEmail, string subject, string body); 
>>>>>>> 277113ebafa3c7c1d7d64e1dcda6049f3a9e535e
    }
}
