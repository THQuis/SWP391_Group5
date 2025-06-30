using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Linq;
using System.Threading.Tasks;
using Smoking.API.Models.Admin;
using Smoking.BLL.Services;
using Smoking.API.Models.Admin;
using System.Security.Claims;

namespace Smoking.API.Controllers.Admin
{
    [ApiController]
    [Route("api/Admin")]
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
                RegistrationDate = u.RegistrationDate.ToString("dd/MM/yyyy HH:mm"),
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
            var allowedStatuses = new[] { "Active", "InActive"};

            if (string.IsNullOrWhiteSpace(newStatus) || !allowedStatuses.Contains(newStatus, StringComparer.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    Message = "Trạng thái không hợp lệ. Chỉ được phép: Active, InActive"
                });
            }

            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(currentUserIdClaim, out int currentUserId))
            {
                if (id == currentUserId)
                {
                    return BadRequest(new { Message = "Bạn không thể tự thay đổi trạng thái của chính mình." });
                }
            }

            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            user.Status = newStatus;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Cập nhật trạng thái User thành công." });
        }



        [HttpDelete("DeleteUser")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });
            user.Status = "InActive";

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Người dùng đã được vô hiệu hóa (InActive)." });
        }



        // 7️ (Optional) Cập nhật Role cho User
        [HttpPut("UpdateRole")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] int newRoleId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });
            // Lấy UserID của người đang đăng nhập từ JWT
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(currentUserIdClaim, out int currentUserId))
            {
                if (id == currentUserId)
                {
                    return BadRequest(new { Message = "Bạn không thể tự thay đổi trạng thái của chính mình." });
                }
            }
            user.RoleID = newRoleId;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Cập nhật Role cho User thành công." });
        }

        //8. Thêm mới User
        [HttpPost("AddUser")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
        {
            var existing = await _unitOfWork.Users.GetByEmailAsync(request.Email);
            if (existing != null)
                return BadRequest(new { Message = "Email đã tồn tại." });

            // Băm mật khẩu trước khi lưu
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = hashedPassword, // đã mã hoá
                PhoneNumber = request.PhoneNumber,
                Status = "Active",
                RoleID = request.RoleID
            };

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Tạo User thành công." });
        }

        [HttpPut("approve-coach-change/{userId}")]
        [Authorize(Roles = "1")] // Admin
        public async Task<IActionResult> ApproveCoachChange(int userId)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null || user.PendingCoachId == null)
                return NotFound(new { Message = "Không có yêu cầu đổi coach nào đang chờ duyệt." });

            // Lấy thông tin coach mới
            var newCoach = await _unitOfWork.Users.GetByIdAsync(user.PendingCoachId.Value);
            if (newCoach == null)
                return NotFound(new { Message = "Huấn luyện viên mới không tồn tại." });

            // Cập nhật coach mới cho user
            user.CoachId = user.PendingCoachId;
            user.PendingCoachId = null;
            user.CoachChangeReason = null; // ✔️ Xoá lý do sau khi duyệt

            _unitOfWork.Users.Update(user);

            // Thông báo
            var notification = new Notification
            {
                NotificationName = "Đã duyệt đổi huấn luyện viên",
                Message = $"Yêu cầu đổi coach của bạn sang {newCoach.FullName} đã được chấp nhận.",
                CreatedBy = "Admin",
                NotificationType = "CoachChangeApproved",
                NotificationFor = "Member",
                Condition = "Unread",
                UserID = user.UserID,
                SentAt = DateTime.Now
            };
            await _unitOfWork.Notifications.AddAsync(notification);

            // Gửi email
            await _mailService.SendEmailAsync(user.Email, "Yêu cầu đổi coach đã được duyệt",
                $"Chào {user.FullName},\n\nYêu cầu đổi sang huấn luyện viên {newCoach.FullName} của bạn đã được duyệt.");

            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Đã duyệt đổi huấn luyện viên cho người dùng." });
        }



        [HttpGet("pending-coach-changes")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> GetPendingCoachChanges()
        {
            var users = await _unitOfWork.Users.GetAllAsync();
            var pending = users.Where(u => u.PendingCoachId != null).ToList();

            return Ok(pending.Select(u => new {
                u.UserID,
                u.FullName,
                CurrentCoachId = u.CoachId,
                RequestedCoachId = u.PendingCoachId,
                 Reason = u.CoachChangeReason
            }));
        }


    }
}
