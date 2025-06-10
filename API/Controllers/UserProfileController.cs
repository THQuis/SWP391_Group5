using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Smoking.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize(Roles = "2")] // Chỉ User (RoleID=2) được vào
    public class UserProfileController : ControllerBase
    {
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            // Lấy UserID từ Token:
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            return Ok(new { Message = "Thông tin profile cá nhân", UserID = userId });
        }

        [HttpGet("notifications")]
        public IActionResult GetNotifications()
        {
            // TODO: Lấy thông báo hỗ trợ cai thuốc
            return Ok(new { Message = "Thông báo hỗ trợ cai thuốc - User" });
        }
    }
}
