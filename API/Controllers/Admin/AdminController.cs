using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Linq;
using System.Threading.Tasks;
using Smoking.API.Models.Admin;
using Smoking.BLL.Services;
using Smoking.API.Models.Achievement;
using Smoking.API.Models.Blog;

namespace Smoking.API.Controllers.Admin
{
    [ApiController]
    [Route("api/Admin")]
    [Authorize(Roles = "1")] // Chỉ Admin (RoleID=1) được vào
    public class AdminController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
       
        public AdminController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 1️ Lấy danh sách User
        [HttpGet("ListUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _unitOfWork.Users.GetAllWithRolesAsync();
            return Ok(users.Select(u => new
            {
                u.UserID,
                u.FullName,
                u.Email,
                u.PhoneNumber,
                u.RegistrationDate,
                u.Status,
                Role = u.Role?.RoleName ?? "Unknown"
            }));
        }

        // 2️ Xem chi tiết 1 User
        [HttpGet("User")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            return Ok(new
            {
                user.UserID,
                user.FullName,
                user.Email,
                user.PhoneNumber,
                user.Status,
                user.RoleID
            });
        }

        // 3️ Cập nhật thông tin User (VD: thay đổi Status)
        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateUserStatus(int id, [FromBody] string newStatus)
        {
            var allowedStatuses = new[] { "Active", "IsActive", "Locked" };

            if (string.IsNullOrWhiteSpace(newStatus) || !allowedStatuses.Contains(newStatus, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    Message = "Trạng thái không hợp lệ. Chỉ được phép: Active, IsActive, Locked."
                });
            }

            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            user.Status = newStatus;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Cập nhật trạng thái User thành công." });
        }


        // 4️ Xóa User   
        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Xóa User thành công." });
        }

        // 5️ Báo cáo hệ thống (thực tế - dùng DB)
        //[HttpGet("reports")]
        //public async Task<IActionResult> GetReports()
        //{
        //    var users = await _unitOfWork.Users.GetAllAsync();
        //    var totalUsers = users.Count();
        //    var activeUsers = users.Count(u => u.Status == "Active");
        //    var lockedUsers = users.Count(u => u.Status == "Locked");

        //    // TODO: sau này có thêm bảng LoginHistory thì tính thêm login count, new user...

        //    var report = new
        //    {
        //        TotalUsers = totalUsers,
        //        ActiveUsers = activeUsers,
        //        LockedUsers = lockedUsers,
        //        // Example static value - có thể cập nhật sau này
        //        NewUsersThisMonth = 5,
        //        TotalLoginCount = 500
        //    };

        //    return Ok(report);
        //}

        // 6 Gửi notification toàn hệ thống (giả sử có NotificationService)
        [HttpPost("Notifications")]
        public IActionResult SendNotification([FromBody] string message)
        {

            return Ok(new { Message = $"Đã gửi notification: {message}" });
        }

        // 7️ (Optional) Cập nhật Role cho User
        [HttpPut("UpdateRole")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] int newRoleId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            user.RoleID = newRoleId;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Cập nhật Role cho User thành công." });
        }

        //1. Thêm mới User
        [HttpPost("AddUser")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            var existing = await _unitOfWork.Users.GetByEmailAsync(request.Email);
            if (existing != null)
                return BadRequest(new { Message = "Email đã tồn tại." });

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,
                PhoneNumber = request.PhoneNumber,
                Status = "Active",
                RoleID = request.RoleID
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Tạo User thành công." });
        }

    }
}
