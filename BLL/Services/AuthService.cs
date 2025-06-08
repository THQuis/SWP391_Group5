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

        public async Task RegisterTempAsync(string fullName, string email, string password, string phoneNumber)
        {
            var existing = await _unitOfWork.Users.GetByEmailAsync(email);
            if (existing != null)
                throw new Exception("Email đã tồn tại.");

            // Tạo OTP
            var otpCode = new Random().Next(100000, 999999).ToString();

            var tempUser = new TempUserRegister
            {
                FullName = fullName,
                Email = email,
                Password = password,
                PhoneNumber = phoneNumber,
                OtpCode = otpCode
            };

            // Lưu cache 5 phút
            _memoryCache.Set($"TEMP_USER_{email}", tempUser, TimeSpan.FromMinutes(5));
            _memoryCache.Set($"OTP_{email}", otpCode, TimeSpan.FromMinutes(5));

            await _mailService.SendOtpEmailAsync(email, otpCode);
        }

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
                        Password = tempUser.Password,
                        PhoneNumber = tempUser.PhoneNumber,
                        Status = "Active",
                        RoleID = 2
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

        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _unitOfWork.Users.GetByEmailAndPasswordAsync(email, password);
            return user;
        }
    }
}
