using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IMailService
    {
        Task SendOtpEmailAsync(string toEmail, string otpCode); 
        Task SendHtmlEmailAsync(string toEmail, string subject, string htmlBody);
        Task SendEmailAsync(string toEmail, string subject, string body); 
    }
}
