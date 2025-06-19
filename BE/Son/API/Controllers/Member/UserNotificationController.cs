using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.User
{
    [ApiController]
    [Route("api/user/notifications")]
    [Authorize(Roles = "2")] // Chỉ dành cho Member
    public class UserNotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public UserNotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // [GET] Xem danh sách thông báo của chính người dùng
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var notifications = await _notificationService.GetByUserIdAsync(userId);
            return Ok(notifications.Select(n => new
            {
                n.NotificationID,
                n.Message,
                n.NotificationDate,
                n.NotificationType,
                SentAt = n.SentAt.ToString("dd/MM/yyyy HH:mm"),
                n.NotificationName
            }));
        }

        // [DELETE] Xóa thông báo (nếu cho phép)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMyNotification(int id)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var list = await _notificationService.GetByUserIdAsync(userId);
            var toDelete = list.FirstOrDefault(x => x.NotificationID == id);
            if (toDelete == null)
                return NotFound(new { Message = "Không tìm thấy thông báo." });

            var success = await _notificationService.DeleteAsync(id);
            return success
                ? Ok(new { Message = "Đã xóa thông báo." })
                : BadRequest(new { Message = "Lỗi khi xóa." });
        }
    }
}
