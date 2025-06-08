using Microsoft.Extensions.Caching.Memory;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Models;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMemoryCache _memoryCache;
        private readonly IMailService _mailService;

        public AuthService(IUnitOfWork unitOfWork, IMemoryCache memoryCache, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _memoryCache = memoryCache;
            _mailService = mailService;
        }

        // -- Đăng ký tạm, gửi OTP --
        public async Task RegisterTempAsync(string fullName, string email, string password, string phoneNumber)
        {
            var existing = await _unitOfWork.Users.GetByEmailAsync(email);
            if (existing != null)
                throw new Exception("Email đã tồn tại.");

            var otpCode = new Random().Next(100000, 999999).ToString();

            var tempUser = new TempUserRegister
            {
                FullName = fullName,
                Email = email,
                Password = password,
                PhoneNumber = phoneNumber,
                OtpCode = otpCode
            };

            _memoryCache.Set($"TEMP_USER_{email}", tempUser, TimeSpan.FromMinutes(5));
            _memoryCache.Set($"OTP_{email}", otpCode, TimeSpan.FromMinutes(5));

            await _mailService.SendOtpEmailAsync(email, otpCode);
        }

        // -- Xác thực OTP đăng ký --
        public async Task<bool> VerifyOtpAndRegisterAsync(string email, string otpCode)
        {
            if (_memoryCache.TryGetValue($"OTP_{email}", out string cachedOtp) && cachedOtp == otpCode)
            {
                if (_memoryCache.TryGetValue($"TEMP_USER_{email}", out TempUserRegister tempUser))
                {
                    var user = new User
                    {
                        FullName = tempUser.FullName,
                        Email = tempUser.Email,
                        Password = tempUser.Password, // Hash password nếu có
                        PhoneNumber = tempUser.PhoneNumber,
                        Status = "Active",
                        RoleID = 2 // Ví dụ role mặc định
                    };

                    await _unitOfWork.Users.AddAsync(user);
                    await _unitOfWork.CompleteAsync();

                    _memoryCache.Remove($"OTP_{email}");
                    _memoryCache.Remove($"TEMP_USER_{email}");

                    return true;
                }
            }
            return false;
        }

        // -- Đăng nhập --
        public async Task<User> AuthenticateAsync(string email, string password)
        {
            // Nếu có hash, so sánh hash ở đây
            var user = await _unitOfWork.Users.GetByEmailAndPasswordAsync(email, password);
            return user;
        }

        // -- Gửi OTP quên mật khẩu --
        public async Task SendForgotPasswordOtpAsync(string email)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                throw new Exception("Email không tồn tại.");

            var otpCode = new Random().Next(100000, 999999).ToString();
            _memoryCache.Set($"RESET_PWD_OTP_{email}", otpCode, TimeSpan.FromMinutes(5));

            string subject = "Đặt lại mật khẩu - Smoking App";
            string htmlBody = $@"
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 20px;'>
        <div style='text-align: center;'>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Smoking_icon.svg/512px-Smoking_icon.svg.png' alt='Logo' style='width: 100px; margin-bottom: 20px;'/>
            <h2>Đặt lại mật khẩu</h2>
        </div>
        <p>Xin chào,</p>
        <p>Bạn hoặc ai đó đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Smoking App.</p>
        <p>Vui lòng sử dụng mã OTP sau để xác nhận:</p>
        <div style='background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;'>
            {otpCode}
        </div>
        <p><strong>Lưu ý:</strong> Mã OTP có hiệu lực trong 5 phút.</p>
        <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        <hr/>
        <p style='text-align: center; color: #888;'>Smoking App © 2025</p>
    </div>";

            await _mailService.SendHtmlEmailAsync(email, subject, htmlBody);
        }

        // -- Xác thực OTP quên mật khẩu --
        public async Task<bool> VerifyForgotPasswordOtpAsync(string email, string otpCode)
        {
            if (_memoryCache.TryGetValue($"RESET_PWD_OTP_{email}", out string cachedOtp) && cachedOtp == otpCode)
            {
                return true;
            }
            return false;
        }

        // -- Đặt lại mật khẩu mới --
        public async Task ResetPasswordAsync(string email, string newPassword)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                throw new Exception("Email không tồn tại.");

            user.Password = newPassword; // Hash password nếu cần

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            _memoryCache.Remove($"RESET_PWD_OTP_{email}");
        }
    }
}
