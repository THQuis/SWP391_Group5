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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _unitOfWork.Users.GetByIdAsync(userId);

            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            // Cập nhật thông tin User
            user.FullName = request.FullName ?? user.FullName;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.ProfilePicture = request.ProfilePicture ?? user.ProfilePicture;

            _unitOfWork.Users.Update(user);

            // ❗️Lưu trước khi thực hiện thao tác khác
            await _unitOfWork.CompleteAsync();

            // ❗️Chỉ sau khi SaveChanges xong mới gửi email
            await _mailService.SendEmailAsync(
                user.Email,
                "Cập nhật thông tin thành công",
                "Thông tin của bạn đã được cập nhật thành công."
            );

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

            // Lấy tất cả thông báo của user từ cơ sở dữ liệu (hoặc có thể lấy thông báo chưa đọc nếu cần)
            var notifications = await _unitOfWork.Notifications.GetAllAsync();

            // Lọc thông báo của người dùng hiện tại (nếu có)
            var userNotifications = notifications.Where(n => n.UserID == userId).ToList();

            // Kiểm tra nếu có thông báo cho người dùng
            if (userNotifications.Any())
            {
                var user = await _unitOfWork.Users.GetByIdAsync(userId);

                // Nếu người dùng có email, gửi thông báo qua email
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    // Kết hợp tất cả thông báo thành một chuỗi văn bản đơn giản
                    var allMessages = string.Join("\n", userNotifications.Select(n => $"{n.NotificationName}: {n.Message}"));

                    // Gửi tất cả thông báo qua email (dạng plain text)
                    try
                    {
                        await _mailService.SendEmailAsync(user.Email, "Thông báo từ hệ thống", allMessages);
                    }
                    catch (Exception ex)
                    {
                        // Nếu có lỗi khi gửi email, log lỗi và trả về thông báo lỗi
                        return BadRequest(new { Message = "Lỗi khi gửi email thông báo: " + ex.Message });
                    }
                }

                // Trả về thông báo trên trang chủ
                return Ok(new { Message = "Đã gửi thông báo qua email và hiển thị trên trang chủ", Notifications = userNotifications });
            }

            // Nếu không có thông báo, trả về thông báo cho người dùng
            return NotFound(new { Message = "Không có thông báo nào." });
        }




    }
}
