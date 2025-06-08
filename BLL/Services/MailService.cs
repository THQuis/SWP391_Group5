using Microsoft.Extensions.Options;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Models;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Smoking.BLL.Services;
public class MailService : IMailService
{
    private readonly EmailSettings _emailSettings;

    public MailService(IOptions<EmailSettings> emailSettings)
    {
        _emailSettings = emailSettings.Value;
    }

    public async Task SendOtpEmailAsync(string toEmail, string otpCode)
    {
        using var smtpClient = new SmtpClient(_emailSettings.SmtpServer)
        {
            Port = _emailSettings.SmtpPort,
            Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.SenderPassword),
            EnableSsl = _emailSettings.EnableSsl,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
            Subject = "Xác thực OTP cho tài khoản Smoking App",
            IsBodyHtml = true,
            Body = $@"
    <div style='font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;'>
        <!-- Header -->
        <div style='background-color: #0078D7; padding: 20px; text-align: center;'>
            <img src='https://yourdomain.com/logo.png' alt='Smoking App Logo' style='height: 50px;' />
        </div>

        <!-- Body -->
        <div style='padding: 30px; background-color: #fff;'>
            <h2 style='color: #0078D7;'>Xác thực OTP cho tài khoản Smoking App</h2>
            <p>Xin chào,</p>
            <p>Mã OTP của bạn là:</p>
            <div style='
                border: 2px solid #0078D7;
                background-color: #e7f3ff;
                padding: 15px 25px;
                display: inline-block;
                font-size: 28px;
                font-weight: bold;
                letter-spacing: 6px;
                color: #0056b3;
                margin: 15px 0;
                border-radius: 6px;
                '>{otpCode}</div>
            <p>Mã có hiệu lực trong <strong>5 phút</strong>. Vui lòng không chia sẻ mã này với người khác.</p>
            <hr style='border:none; border-top:1px solid #eee;' />
            <p style='font-size: 14px; color: #555;'>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,<br/>Đội ngũ Smoking App</p>
        </div>

        <!-- Footer -->
        <div style='background-color: #f4f4f4; padding: 15px 30px; font-size: 12px; color: #999; text-align: center;'>
            <p>Smoking App &copy; 2025. Mọi quyền được bảo lưu.</p>
            <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
            <p>Email hỗ trợ: support@smokingapp.com | Hotline: 0123 456 789</p>
        </div>
    </div>"
        };


        mailMessage.To.Add(toEmail);
        await smtpClient.SendMailAsync(mailMessage);
    }
}
