using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/user")]
    [Authorize(Roles = "2")] // Chỉ User (RoleID = 2) được vào
    public class UserProfileController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;

        public UserProfileController(IUserService userService, IUnitOfWork unitOfWork, IMailService mailService)
        {
            _userService = userService;
            _unitOfWork = unitOfWork;
            _mailService = mailService;
        }

        // 1️⃣ Lấy thông tin hồ sơ cá nhân
 
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { Message = "Không xác định được người dùng." });

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "Người dùng không tồn tại." });

            return Ok(new
            {
                Message = "Thông tin cá nhân",
                User = new
                {
                    user.UserID,
                    user.FullName,
                    user.Email,
                    user.PhoneNumber,
                    user.ProfilePicture,
                    user.Description,
                    RegistrationDate = user.RegistrationDate.ToString("yyyy-MM-dd"),
                    RoleName = user.Role?.RoleName ?? "Unknown",
                    DateOfBirth = user.DateOfBirth.HasValue ? user.DateOfBirth.Value.ToString("yyyy-MM-dd") : null,
                    user.Gender,
                    user.Status
                }
            });
        }



        // 2️⃣ Cập nhật hồ sơ cá nhân
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            user.FullName = request.FullName ?? user.FullName;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.ProfilePicture = request.ProfilePicture ?? user.ProfilePicture;
            user.Description = request.Description ?? user.Description; // ✅ THÊM MÔ TẢ

            await _userService.UpdateAsync(user);

            await _mailService.SendEmailAsync(
                user.Email,
                "Cập nhật thông tin thành công",
                "Thông tin của bạn đã được cập nhật thành công."
            );

            return Ok(new { Message = "Cập nhật thông tin thành công!" });
        }


        // 3️⃣ Xoá tài khoản (xoá mềm - chỉ đổi trạng thái)
        [HttpDelete("delete-profile")]
        public async Task<IActionResult> DeleteProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "Người dùng không tồn tại." });

            user.Status = "Deleted";
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            // ✅ Gửi mail sau khi context đã xong và KHÔNG chạy song song bằng Task.Run
            try
            {
                await _mailService.SendEmailAsync(
                    user.Email,
                            "Tài khoản bị vô hiệu hoá",
                            @"Tài khoản của bạn đã bị vô hiệu hoá khỏi hệ thống.
                            Nếu bạn thực hiện thao tác này một cách nhầm lẫn hoặc muốn khôi phục tài khoản, vui lòng liên hệ Ban quản lý hoặc Quản trị viên để được hỗ trợ."
                );
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    Message = "Tài khoản đã được vô hiệu hoá, nhưng lỗi khi gửi email.",
                    Error = ex.Message
                });
            }

            return Ok(new { Message = "Tài khoản đã được vô hiệu hoá." });
        }


        // 4️⃣ Lấy danh sách thông báo của user
        [HttpGet("notifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var notifications = await _unitOfWork.Notifications.GetAllAsync();

            var userNotifications = notifications
                .Where(n => n.UserID == userId)
                .ToList();

            if (!userNotifications.Any())
                return NotFound(new { Message = "Không có thông báo nào." });

            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user != null && !string.IsNullOrWhiteSpace(user.Email))
            {
                var allMessages = string.Join("\n", userNotifications.Select(n => $"{n.NotificationName}: {n.Message}"));

                try
                {
                    await _mailService.SendEmailAsync(
                        user.Email,
                        "Thông báo từ hệ thống",
                        allMessages
                    );
                }
                catch (Exception ex)
                {
                    return BadRequest(new { Message = "Lỗi gửi email: " + ex.Message });
                }
            }

            return Ok(new
            {
                Message = "Lấy thông báo thành công",
                Notifications = userNotifications
            });
        }
    }
}
