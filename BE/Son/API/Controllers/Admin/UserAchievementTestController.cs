using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Test
{
    [Route("api/test/userachievement")]
    [ApiController]
    public class UserAchievementTestController : ControllerBase
    {
        private readonly IUserAchievementService _userAchievementService;

        public UserAchievementTestController(IUserAchievementService userAchievementService)
        {
            _userAchievementService = userAchievementService;
        }

        /// <summary>
        /// Test cấp thành tựu cho user
        /// </summary>
        /// <param name="userId">Id user</param>
        /// <param name="achievementId">Id thành tựu</param>
        /// <returns></returns>
        [HttpPost("grant")]
        public async Task<IActionResult> GrantAchievement(int userId, int achievementId)
        {
            var result = await _userAchievementService.GrantAchievementAsync(userId, achievementId);

            if (result)
                return Ok(new { Message = "Đã cấp thành tựu thành công" });
            else
                return BadRequest(new { Message = "Cấp thành tựu thất bại (user hoặc achievement không tồn tại, hoặc đã cấp trước đó)" });
        }
    }
}
