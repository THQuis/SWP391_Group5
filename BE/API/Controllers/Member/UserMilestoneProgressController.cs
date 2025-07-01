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
        private readonly IMilestoneService _milestoneService; // Thêm service để lấy dữ liệu các mốc

        public UserMilestoneProgressController(
            IUserMilestoneProgressService userMilestoneProgressService,
            IMilestoneService milestoneService) // Inject thêm service milestone
        {
            _userMilestoneProgressService = userMilestoneProgressService;
            _milestoneService = milestoneService; // Khởi tạo service milestone
        }

        // Lấy tất cả tiến trình của người dùng và tự động thêm vào
        [HttpGet("list")]
        public async Task<IActionResult> GetAll()
        {
            // Lấy UserID từ JWT token một cách an toàn
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !int.TryParse(userIdStr, out var userId))
            {
                return Unauthorized(new { message = "Không thể xác định ID người dùng." });
            }

            // Lấy danh sách các mốc tiến trình có sẵn trong hệ thống
            var allMilestones = await _milestoneService.GetAllAsync();

            if (allMilestones == null || !allMilestones.Any())
                return NotFound(new { message = "Không có mốc tiến trình nào trong hệ thống." });

            // Lấy tất cả tiến trình của người dùng từ service
            var progressList = await _userMilestoneProgressService.GetAllByUserIdAsync(userId);

            // Nếu người dùng chưa có tiến trình nào, sẽ tự động gán mốc mới cho họ
            if (progressList == null || !progressList.Any())
            {
                // Lặp qua tất cả các mốc và tạo tiến trình cho người dùng
                foreach (var milestone in allMilestones)
                {
                    var userMilestoneProgress = new UserMilestoneProgress
                    {
                        UserID = userId,
                        MilestoneID = milestone.MilestoneID,
                        AchievedDate = null, // Chưa hoàn thành, vì chưa đạt được mốc nào
                    };

                    // Gọi service để lưu tiến trình mới vào cơ sở dữ liệu
                    await _userMilestoneProgressService.AddAsync(userMilestoneProgress);
                }

                // Cập nhật lại danh sách tiến trình của người dùng sau khi tự động thêm
                progressList = await _userMilestoneProgressService.GetAllByUserIdAsync(userId);
            }

            // Trả về danh sách tiến trình của người dùng
            var result = progressList.Select(up => new
            {
                up.UserMilestoneID,
                up.MilestoneID,
                MilestoneName = up.Milestone?.Name ?? "N/A",
                up.AchievedDate,
                PackageMilestones = up.Milestone?.PackageMilestones ?? new List<PackageMilestone>()
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
