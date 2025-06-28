using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/user-challenges")]
[Authorize(Roles = "2")]
public class UserQuitChallengeController : ControllerBase
{
    private readonly IUserQuitChallengeService _challengeService;

    public UserQuitChallengeController(IUserQuitChallengeService challengeService)
    {
        _challengeService = challengeService;
    }

    [HttpPost("{userId}/assign-stage")]
    public async Task<IActionResult> AssignStageChallenges(int userId, [FromQuery] int stage)
    {
        var count = await _challengeService.AssignChallengesToUserAsync(userId, stage);

        if (count == 0)
        {
            return Ok(new { success = false, message = "Người dùng đã nhận thử thách cho giai đoạn này trước đó." });
        }

        return Ok(new { success = true, message = $"Đã nhận {count} thử thách cho người dùng." });
    }

    [HttpGet("{userId}/stage")]
    public async Task<IActionResult> GetChallengesForStage(int userId, [FromQuery] int stage = 1)
    {
        var challenges = await _challengeService.GetChallengesForStageAsync(userId, stage);
        var today = DateTime.Today;
        var ordered = challenges.OrderBy(c => c.ChallengeDate).ToList();
        var result = new List<object>();

        bool allowNext = true;
        string? message = null;

        for (int i = 0; i < ordered.Count; i++)
        {
            var challenge = ordered[i];

            bool isLocked;
            if (i == 0)
            {
                isLocked = challenge.ChallengeDate > today;
            }
            else
            {
                var prev = ordered[i - 1];
                isLocked = challenge.ChallengeDate > today || !prev.IsCompleted || !allowNext;
            }

            if (isLocked)
            {
                allowNext = false;
            }

            result.Add(new
            {
                challenge.Id,
                challenge.Template.Title,
                Description = challenge.Template.Description,
                challenge.ChallengeDate,
                challenge.IsCompleted,
                challenge.Notes,
                IsLocked = isLocked
            });
        }

        // Xác định thử thách hôm nay
        var todayChallenge = ordered.FirstOrDefault(c => c.ChallengeDate.Date == today);

        if (todayChallenge != null)
        {
            var index = ordered.IndexOf(todayChallenge);
            bool isLocked = false;

            if (index == 0)
            {
                isLocked = todayChallenge.ChallengeDate > today;
            }
            else
            {
                var prev = ordered[index - 1];
                isLocked = todayChallenge.ChallengeDate > today || !prev.IsCompleted;
            }

            if (isLocked)
            {
                message = "Thử thách hôm nay chưa được mở. Bạn cần hoàn thành thử thách hôm trước.";
            }
            else
            {
                message = todayChallenge.IsCompleted
                    ? "Bạn đã hoàn thành thử thách hôm nay!"
                    : "Bạn chưa hoàn thành thử thách hôm nay!";
            }
        }
        else
        {
            message = "Không có thử thách nào ứng với ngày hôm nay.";
        }

        return Ok(new
        {
            message,
            data = result
        });
    }

    [HttpPost("complete")]
    public async Task<IActionResult> CompleteChallenge([FromBody] CompleteChallengeRequest request)
    {
        try
        {
            await _challengeService.MarkAsCompletedAsync(request.ChallengeId, request.Notes);
            return Ok(new { success = true, message = "Đánh dấu hoàn thành thành công." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }


    [HttpPost("uncomplete")]
    public async Task<IActionResult> UncompleteChallenge([FromBody] UncompleteChallengeRequest request)
    {
        await _challengeService.UnmarkAsCompletedAsync(request.ChallengeId);
        return Ok(new { success = true, message = "Đã huỷ trạng thái hoàn thành." });
    }

    public class CompleteChallengeRequest
    {
        public int ChallengeId { get; set; }
        public string? Notes { get; set; }
    }

    public class UncompleteChallengeRequest
    {
        public int ChallengeId { get; set; }
    }
}
