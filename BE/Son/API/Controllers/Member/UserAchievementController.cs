using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using System.Threading.Tasks;

namespace Smoking.API.Controllers
{
    [Route("api/user-achievement")]
    [ApiController]
    [Authorize] 
    public class UserAchievementController : ControllerBase
    {
        private readonly IUserAchievementService _userAchievementService;

        public UserAchievementController(IUserAchievementService userAchievementService)
        {
            _userAchievementService = userAchievementService;
        }

        [HttpGet("my-achievements/{userId}")]
        public async Task<IActionResult> GetUserAchievements(int userId)
        {
            var achievements = await _userAchievementService.GetByUserIdAsync(userId);
            return Ok(achievements);
        }

        [HttpPost("grant")]
        [Authorize(Roles = "1,2")] // ví dụ: admin và coach mới được cấp
        public async Task<IActionResult> GrantAchievement(int userId, int achievementId)
        {

            var result = await _userAchievementService.GrantAchievementAsync(userId, achievementId);
            if (result)
                return Ok(new { Message = "Đã cấp thành tựu thành công" });
            else
                return BadRequest(new { Message = "Cấp thất bại: đã có thành tựu trước đó." });
        }
    }
}
