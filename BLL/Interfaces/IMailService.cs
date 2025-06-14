namespace Smoking.BLL.Interfaces
{
    public interface IMailService
    {
        // Phương thức gửi email OTP (cũ)
        Task SendOtpEmailAsync(string toEmail, string otpCode);

        // Phương thức gửi email thông thường với nội dung là plain text
        Task SendEmailAsync(string toEmail, string subject, string message);

        // Phương thức gửi email với nội dung HTML (dùng cho quên mật khẩu)
        Task SendHtmlEmailAsync(string toEmail, string subject, string htmlBody); // Phương thức mới
    }
}
