using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces; // Dùng interface chứ không phải BLL.Services trực tiếp
using System.Security.Claims;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/user")]
    [Authorize(Roles = "2")] // Chỉ User (RoleID=2) được vào
    public class UserProfileController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserProfileController(IUserService userService)
        {
            _userService = userService;
        }

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
                    //user.Description,
                    RegistrationDate = user.RegistrationDate.ToString("yyyy-MM-dd"),
                    RoleName = user.Role?.RoleName ?? "Unknown",
                    user.Status
                }
            });
        }
        [HttpGet("notifications")]
        public IActionResult GetNotifications()
        {
            return Ok(new { Message = "Thông báo hỗ trợ cai thuốc - User" });
        }

        [HttpDelete("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest request)
        {
            try
            {
                await _userService.DeleteUserByEmailAsync(request.Email);
                return Ok(new { Message = "Xoá user thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                await _userService.UpdateProfileAsync(request.Email, request.FullName, request.PhoneNumber, request.ProfilePicture);
                return Ok(new { Message = "Cập nhật thông tin thành công." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
