using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.Admin;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1")] 
    public class NotificationAdminController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly IMailService _mailService;
        private readonly IUserService _userService;

        public NotificationAdminController(INotificationService notificationService, IMailService mailService, IUserService userService)
        {
            _notificationService = notificationService;
            _mailService = mailService;
            _userService = userService;
        }

        // Lấy tất cả thông báo
        [HttpGet("list")]
        public async Task<IActionResult> GetAllNotifications()
        {
            var notifications = await _notificationService.GetAllAsync();
            return Ok(notifications.Select(n => new
            {
                n.NotificationID,
                n.UserID,
                n.Message,
                n.NotificationDate,
                n.NotificationType,
                SenAt = n.SentAt.ToString("dd/MM/yyyy HH:mm"),
                NotificationName = n.NotificationName ?? "No Name",     
                Condition = n.Condition ?? "No Condition",               
                NotificationFor = n.NotificationFor ?? "No Recipient",    
                CreatedBy = n.CreatedBy ?? "Unknown"                      
            }));
        }


        // Lấy thông báo của người dùng theo UserID
        [HttpGet("getNotificationUserID")]
        public async Task<IActionResult> GetUserNotifications(int userId)
        {
            var notifications = await _notificationService.GetByUserIdAsync(userId);
            return Ok(notifications.Select(n => new
            {
                n.NotificationID,
                n.Message,
                n.NotificationDate,
                n.NotificationType,
                n.SentAt,
                AuthorName = n.User?.FullName,
                RoleName = n.User?.Role?.RoleName
            }));
        }

        // Tạo và gửi thông báo
        [HttpPost("send")]
        public async Task<IActionResult> SendNotification([FromBody] SendNotificationRequest request)
        {
            List<Notification> sentNotifications = new List<Notification>();
            IEnumerable<User> users = new List<User>();

            if (request.ToAllUsers)
            {
                users = await _userService.GetAllAsync();
            }
            else if (request.ToRole != null)
            {
                users = await _userService.GetUsersByRoleAsync(request.ToRole);
            }
            else if (!string.IsNullOrEmpty(request.Email))
            {
                var user = await _userService.GetByEmailAsync(request.Email);
                if (user != null)
                {
                    users = new List<User> { user };
                }
            }

            foreach (var user in users)
            {
                var notification = new Notification
                {
                    UserID = user.UserID,
                    Message = request.Message,
                    NotificationType = request.NotificationType,
                    SentAt = System.DateTime.UtcNow,
                    NotificationName = request.NotificationName,
                    Condition = request.Condition, 
                    NotificationFor = request.NotificationFor,
                    CreatedBy = "Admin"  // Hoặc lấy từ hệ thống admin
                };

                await _notificationService.CreateAsync(notification);

                if (!string.IsNullOrEmpty(user.Email))
                {
                    await _mailService.SendEmailAsync(user.Email, "Thông báo từ hệ thống", request.Message);
                }

                sentNotifications.Add(notification);
            }

            return Ok(new { Message = "Thông báo đã được gửi." });
        }

        // Xóa thông báo
        [HttpDelete("deleteNotification")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var success = await _notificationService.DeleteAsync(id);
            if (!success) return NotFound();
            return Ok(new { Message = "Đã xóa thông báo." });
        }
    }
}
