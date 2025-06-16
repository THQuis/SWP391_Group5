using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Services;
using Smoking.DAL.Interfaces.Repositories;
using Smoking.DAL.Entities;
using System.Security.Claims;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/user")]
    [Authorize(Roles = "2")] // Chỉ User (RoleID=2) được vào
    public class UserProfileController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUnitOfWork _unitOfWork; // Inject IUnitOfWork
        private readonly IMailService _mailService;  // Inject MailService

        // Inject IUnitOfWork và IMailService vào Controller
        public UserProfileController(IUserService userService, IUnitOfWork unitOfWork, IMailService mailService)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;  // Initialize IUnitOfWork
            _mailService = mailService;  // Initialize IMailService
        }

        // 1️⃣ Lấy thông tin profile của user
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { Message = "Invalid user." });
            }

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { Message = "User không tồn tại." });
            }

            return Ok(new
            {
                Message = "Thông tin profile cá nhân",
                User = new
                {
                    user.UserID,
                    user.FullName,
                    user.Email,
                    user.PhoneNumber,
                    user.ProfilePicture,
                    RegistrationDate = user.RegistrationDate.ToString("yyyy-MM-dd"),
                    RoleName = user.Role?.RoleName,
                    user.Status
                }
            });
        }

        // 2️⃣ Cập nhật thông tin User
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            // Cập nhật thông tin User
            user.FullName = request.FullName ?? user.FullName;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.ProfilePicture = request.ProfilePicture ?? user.ProfilePicture;

            // Cập nhật thông tin trong DB qua UnitOfWork
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            // Gửi email thông báo
            await _mailService.SendEmailAsync(user.Email, "Cập nhật thông tin thành công", "Thông tin của bạn đã được cập nhật thành công.");

            return Ok(new { Message = "Cập nhật thông tin thành công!" });
        }

        // 3️⃣ Xóa User
        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteProfile()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            // Lấy thông tin User từ DB qua UnitOfWork
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            // Xóa User khỏi hệ thống qua UnitOfWork
            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();

            // Gửi email thông báo
            await _mailService.SendEmailAsync(user.Email, "Tài khoản đã bị xóa", "Tài khoản của bạn đã bị xóa thành công.");

            return Ok(new { Message = "Xóa tài khoản thành công." });
        }

        // 4️⃣ Lấy thông báo và hiển thị trên trang chủ
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            // Lấy thông báo hỗ trợ cai thuốc từ cơ sở dữ liệu (hoặc từ dịch vụ)
            // Ví dụ: lấy tất cả thông báo chưa đọc
            var notifications = await _unitOfWork.Notifications.GetAllAsync();

            // Gửi thông báo qua email (ví dụ gửi tất cả thông báo cho user qua email)
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user != null)
            {
                // Kết hợp tất cả thông báo thành một chuỗi văn bản đơn giản
                var allMessages = string.Join("\n", notifications.Select(n => $"{n.NotificationName}: {n.Message}"));

                // Gửi tất cả thông báo trong một email duy nhất (dạng plain text)
                await _mailService.SendEmailAsync(user.Email, "Thông báo từ hệ thống", allMessages);
            }

            // Trả về thông báo trên trang chủ
            return Ok(new { Message = "Đã gửi thông báo qua email và hiển thị trên trang chủ", Notifications = notifications });
        }



    }
}
