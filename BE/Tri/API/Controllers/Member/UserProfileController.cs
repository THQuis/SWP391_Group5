using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces; // Dùng interface chứ không phải BLL.Services trực tiếp

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
        public IActionResult GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return Ok(new { Message = "Thông tin profile cá nhân", UserID = userId });
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
