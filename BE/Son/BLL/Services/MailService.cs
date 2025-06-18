using Microsoft.Extensions.Options;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Models;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class MailService : IMailService
    {
        private readonly EmailSettings _emailSettings;

        public MailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otpCode)
        {
            string subject = "Xác thực đăng ký tài khoản - Smoking App";
            string htmlBody = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;'>
                    <h2>Xác thực đăng ký tài khoản</h2>
                    <p>OTP của bạn: <strong>{otpCode}</strong></p>
                    <p>Mã có hiệu lực trong 5 phút.</p>
                </div>";
            await SendHtmlEmailAsync(toEmail, subject, htmlBody);
        }

        public async Task SendHtmlEmailAsync(string toEmail, string subject, string htmlBody)
        {
            using (var smtpClient = CreateSmtpClient())
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };
                mailMessage.To.Add(toEmail);
                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            using (var smtpClient = CreateSmtpClient())
            {
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(toEmail);
                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        private SmtpClient CreateSmtpClient()
        {
            return new SmtpClient(_emailSettings.SmtpServer)
            {
                Port = _emailSettings.SmtpPort,
                Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.SenderPassword),
                EnableSsl = _emailSettings.EnableSsl
            };
        }
    }
}
