using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace WebTestAPI.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        // Gửi email với nội dung HTML
        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var message = new MimeMessage();
                // Địa chỉ email người gửi (có thể sử dụng từ config)
                message.From.Add(new MailboxAddress("QuitSmart", _config["Email:Username"])); // Lấy từ cấu hình
                // Địa chỉ email người nhận
                message.To.Add(new MailboxAddress("", toEmail));
                // Tiêu đề email
                message.Subject = subject;

                // Đặt nội dung email là HTML
                message.Body = new TextPart("html") { Text = body };

                using var client = new SmtpClient();

                // Kết nối đến SMTP server
                await client.ConnectAsync(
                    _config["Email:Host"], // Host SMTP
                    int.Parse(_config["Email:Port"]), // Cổng SMTP
                    MailKit.Security.SecureSocketOptions.StartTls // Kết nối an toàn
                );

                // Xác thực người gửi (username và password)
                await client.AuthenticateAsync(
                    _config["Email:Username"], // Tên người dùng
                    _config["Email:Password"] // Mật khẩu người dùng
                );

                // Gửi email
                await client.SendAsync(message);

                // Đóng kết nối
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
