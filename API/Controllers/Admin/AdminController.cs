using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;
using Smoking.API.Models.Notification;

namespace Smoking.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "1")] // Chỉ Admin (RoleID=1) được vào
    public class AdminController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;

        public AdminController(IUnitOfWork unitOfWork, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _mailService = mailService;
        }

        // 1️⃣ Lấy danh sách User
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _unitOfWork.Users.GetAllAsync();
            return Ok(users);
        }

        // 2️⃣ Xem chi tiết 1 User
        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            return Ok(user);
        }

        // 3️⃣ Cập nhật thông tin User (VD: thay đổi Status)
        [HttpPut("users/{id}/status")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] string newStatus)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            user.Status = newStatus;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Cập nhật trạng thái User thành công." });
        }

        // 4️⃣ Xóa User
        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Xóa User thành công." });
        }

        [HttpPost("notifications/send")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
        {
            // Kiểm tra nếu email được cung cấp
            if (!string.IsNullOrEmpty(request.Email))
            {
                // Tìm người dùng theo email
                var user = await _unitOfWork.Users.GetByEmailAsync(request.Email);
                if (user == null)
                {
                    return NotFound(new { Message = "User không tồn tại." });
                }

                // Gửi thông báo cho người dùng cụ thể
                await _mailService.SendEmailAsync(user.Email, "Thông báo từ hệ thống Smoking App", request.Message);
                return Ok(new { Message = $"Đã gửi thông báo tới email {request.Email}" });
            }

            // Nếu email không có, gửi cho tất cả người dùng có roleId = 2 hoặc 3
            if (request.RoleId == 2 || request.RoleId == 3)
            {
                var users = await _unitOfWork.Users.GetByRoleIdAsync(request.RoleId);  // Lấy tất cả User hoặc Coach dựa trên RoleId
                foreach (var user in users)
                {
                    await _mailService.SendEmailAsync(user.Email, "Thông báo từ hệ thống Smoking App", request.Message);
                }

                // Trả lời thông báo cho tất cả User hoặc Coach
                return Ok(new { Message = $"Đã gửi thông báo cho tất cả người dùng với roleId = {request.RoleId}." });
            }

            // Nếu không có roleId hợp lệ
            return BadRequest(new { Message = "RoleId không hợp lệ. Chỉ có thể chọn 2 (User) hoặc 3 (Coach)." });
        }








    }
}
