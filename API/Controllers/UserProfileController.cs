using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.Account;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Smoking.API.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize(Roles = "2")] // Chỉ User (RoleID=2) được vào
    public class UserProfileController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        // Inject IUnitOfWork vào Controller
        public UserProfileController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 1️⃣ Lấy thông tin profile của user
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            // Lấy UserID từ Token:
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            return Ok(new { Message = "Thông tin profile cá nhân", UserID = userId });
        }

        [HttpPut("update")] // Cập nhật thông tin User
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            // Lấy UserID từ Token
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            // Lấy thông tin User từ DB qua UnitOfWork
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            // Cập nhật thông tin User nếu có thay đổi
            user.FullName = request.FullName ?? user.FullName; // Nếu không có giá trị mới, giữ nguyên
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber; // Nếu không có giá trị mới, giữ nguyên
            user.ProfilePicture = request.ProfilePicture ?? user.ProfilePicture; // Nếu không có giá trị mới, giữ nguyên

            // Cập nhật thông tin trong DB qua UnitOfWork
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Cập nhật thông tin thành công!" });
        }


        // 3️⃣ Xóa User
        [HttpDelete("profile")]
        public async Task<IActionResult> DeleteProfile()
        {
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            // Lấy thông tin User từ DB qua UnitOfWork
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { Message = "User không tồn tại." });

            // Xóa User khỏi hệ thống qua UnitOfWork
            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Xóa tài khoản thành công." });
        }

        // 4️⃣ Lấy thông báo
        [HttpGet("notifications")]
        public IActionResult GetNotifications()
        {
            // TODO: Lấy thông báo hỗ trợ cai thuốc
            return Ok(new { Message = "Thông báo hỗ trợ cai thuốc - User" });
        }
    }
}
