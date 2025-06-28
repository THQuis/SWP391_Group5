using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.DAL.Interfaces.Repositories;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/user/coach")]
    [Authorize(Roles = "2")] 
    public class UserCoachController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserCoachController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 🔹 1. Lấy danh sách tất cả các coach đang hoạt động
        [HttpGet("list")]
        [AllowAnonymous] // Hoặc [Authorize] nếu chỉ cho user login xem
        public async Task<IActionResult> GetAllCoaches()
        {
            var coaches = await _unitOfWork.Users.GetUsersByRoleAsync(roleId: 3); 

            return Ok(coaches.Select(c => new
            {
                CoachId = c.UserID,
                FullName = c.FullName,
                Email = c.Email,
                Phone = c.PhoneNumber,
                Description = c.Description,
                Gender = c.Gender,
                DateOfBirth = c.DateOfBirth,
                ProfilePicture = c.ProfilePicture
            }));
        }

        // 🔹 2. Chọn coach (chỉ khi user có gói Premium còn hiệu lực)
        [HttpPost("choose/{coachId}")]
        public async Task<IActionResult> ChooseCoach(int coachId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            // 🟡 Kiểm tra membership Premium còn hiệu lực
            var activeMembership = await _unitOfWork.UserMemberships.GetLatestValidMembershipByUserIdAsync(userId);
            if (activeMembership == null)
                return BadRequest(new { Message = "Bạn chưa đăng ký gói Premium hoặc gói đã hết hạn." });

            var package = await _unitOfWork.MembershipPackages.GetByIdAsync(activeMembership.PackageID);
            if (package == null || !package.PackageType.Equals("Premium", System.StringComparison.OrdinalIgnoreCase))
                return BadRequest(new { Message = "Chỉ người dùng có gói Premium mới được chọn huấn luyện viên." });

            // 🟢 Gán CoachId cho user
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null) return NotFound();

            user.CoachId = coachId;
            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Đã chọn huấn luyện viên thành công." });
        }

        // 🔹 3. Xem thông tin coach đã chọn
        [HttpGet("my-coach")]
        public async Task<IActionResult> GetMyCoach()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _unitOfWork.Users.GetByIdWithCoachAsync(userId);

            if (user == null || user.CoachId == null)
                return NotFound(new { Message = "Bạn chưa chọn huấn luyện viên." });

            var coach = user.Coach;
            return Ok(new
            {
                CoachId = coach.UserID,
                FullName = coach.FullName,
                Email = coach.Email,
                Phone = coach.PhoneNumber,
                Description = coach.Description,
                Gender = coach.Gender,
                ProfilePicture = coach.ProfilePicture
            });
        }
    }
}
