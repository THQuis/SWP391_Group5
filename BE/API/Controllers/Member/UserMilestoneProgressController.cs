using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace Smoking.API.Controllers
{
    [ApiController]
    [Route("api/user/milestones")]
    [Authorize(Roles = "2")] // Chỉ người dùng (RoleID = 2) mới có quyền truy cập
    public class UserMilestoneProgressController : ControllerBase
    {
        private readonly IUserMilestoneProgressService _userMilestoneProgressService;

        public UserMilestoneProgressController(IUserMilestoneProgressService userMilestoneProgressService)
        {
            _userMilestoneProgressService = userMilestoneProgressService;
        }

        // Lấy tất cả tiến trình của người dùng
        [HttpGet("list")]
        public async Task<IActionResult> GetAll()
        {
            // Lấy UserID từ JWT token một cách an toàn
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác định ID người dùng." });
            }

            var progressList = await _userMilestoneProgressService.GetAllByUserIdAsync(userId);

            if (progressList == null || !progressList.Any())
                return NotFound(new { message = "Bạn chưa hoàn thành bất kỳ mốc nào." });

            var result = progressList.Select(up => new
            {
                up.UserMilestoneID,
                up.MilestoneID,
                MilestoneName = up.Milestone?.Name ?? "N/A",
                up.AchievedDate
            }).ToList();

            return Ok(result);
        }

        // Lấy tiến trình của người dùng theo ID tiến trình
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Lấy UserID từ JWT token một cách an toàn
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác định ID người dùng." });
            }

            var progress = await _userMilestoneProgressService.GetByIdAsync(id);

            // Kiểm tra quyền sở hữu tiến trình
            if (progress == null || progress.UserID != userId)
                return NotFound(new { message = "Không tìm thấy tiến trình hoặc tiến trình không thuộc người dùng này." });

            return Ok(progress);
        }
    }
}
