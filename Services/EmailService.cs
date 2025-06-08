using MailKit.Net.Smtp;
using MimeKit;

namespace WebTestAPI.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("QuitSmart", _config["Email:Username"])); // dùng Username chứ không phải From
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;
                message.Body = new TextPart("plain") { Text = body };

                using var client = new SmtpClient();
                await client.ConnectAsync(
                    _config["Email:Host"],
                    int.Parse(_config["Email:Port"]),
                    MailKit.Security.SecureSocketOptions.StartTls
                );

                await client.AuthenticateAsync(
                    _config["Email:Username"],
                    _config["Email:Password"]
                );

                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Gửi email thất bại: " + ex.Message);
                throw new Exception($"Không gửi được email: {ex.Message}");
            }
        }
    }
}