using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Smoking.API.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "1")] // Chỉ Admin (RoleID=1) được vào
    public class AdminController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

        // 6️⃣ Gửi notification (giả sử có NotificationService)
        [HttpPost("notifications/send")]
        public IActionResult SendNotification([FromBody] string message)
        {
            // TODO: Gửi notification đến tất cả user (broadcast)
            // Nếu có NotificationService thì inject vào và gọi ở đây

            return Ok(new { Message = $"Đã gửi notification: {message}" });
        }
    }
}
