using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Threading.Tasks;

namespace Smoking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAchievementController : ControllerBase
    {
        private readonly IUserAchievementService _userAchievementService;

        public UserAchievementController(IUserAchievementService userAchievementService)
        {
            _userAchievementService = userAchievementService;
        }

        // Lấy thành tích của người dùng
        [HttpGet("get-achievements/{userId}")]
        public async Task<IActionResult> GetUserAchievements(int userId)
        {
            var achievements = await _userAchievementService.GetByUserIdAsync(userId);
            if (achievements == null || !achievements.Any())
            {
                return NotFound("No achievements found for this user.");
            }
            return Ok(achievements);
        }

        // Thêm thành tích cho người dùng
        [HttpPost("add-achievement")]
        public async Task<IActionResult> AddUserAchievement([FromBody] UserAchievement userAchievement)
        {
            if (userAchievement == null)
            {
                return BadRequest("Invalid achievement data.");
            }

            await _userAchievementService.CreateAsync(userAchievement);
            return Ok("Achievement added successfully.");
        }

        // Xóa thành tích của người dùng
        [HttpDelete("delete-achievement/{id}")]
        public async Task<IActionResult> DeleteUserAchievement(int id)
        {
            var result = await _userAchievementService.DeleteAsync(id);
            if (!result)
            {
                return NotFound("Achievement not found.");
            }
            return Ok("Achievement deleted successfully.");
        }
    }
}
