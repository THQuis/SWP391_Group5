using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
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
        try
        {
            var count = await _challengeService.AssignChallengesToUserAsync(userId, stage);

            if (count == 0)
            {
                return Ok(new { success = false, message = "Người dùng đã nhận thử thách cho giai đoạn này trước đó." });
            }

            return Ok(new { success = true, message = $"Đã nhận {count} thử thách cho người dùng tuần này." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }


    [HttpGet("{userId}/week")]
    public async Task<IActionResult> GetChallengesForWeek(int userId, [FromQuery] DateTime weekStart, [FromQuery] int stage = 1)
    {
        var challenges = await _challengeService.GetProgressiveChallengesForWeekAsync(userId, weekStart, stage);
        var today = DateTime.Today;

        var finalResult = new List<UserQuitChallenge>();
        string? message = null;

        foreach (var challenge in challenges.OrderBy(c => c.ChallengeDate))
        {
            if (finalResult.Count == 0)
            {
                if (challenge.ChallengeDate.Date <= today)
                    finalResult.Add(challenge);
                else
                    break;
            }
            else
            {
                var previous = finalResult.Last();

                if (previous.IsCompleted && challenge.ChallengeDate.Date <= today)
                    finalResult.Add(challenge);
                else
                    break;
            }
        }

        var todayChallenge = finalResult.FirstOrDefault(c => c.ChallengeDate.Date == today);
        if (todayChallenge != null)
        {
            message = todayChallenge.IsCompleted
                ? "Bạn đã hoàn thành thử thách hôm nay!"
                : "Bạn chưa hoàn thành thử thách hôm nay!";
        }

        return Ok(new
        {
            message,
            data = finalResult
        });
    }


    [HttpPost("complete")]
    public async Task<IActionResult> CompleteChallenge([FromBody] CompleteChallengeRequest request)
    {
        await _challengeService.MarkAsCompletedAsync(request.ChallengeId, request.Notes);
        return Ok(new { success = true, message = "Đánh dấu hoàn thành thành công." });
    }

    [HttpPost("uncomplete")]
    public async Task<IActionResult> UncompleteChallenge([FromBody] UncompleteChallengeRequest request)
    {
        await _challengeService.UnmarkAsCompletedAsync(request.ChallengeId);
        return Ok(new { success = true, message = "Đã huỷ trạng thái hoàn thành." });
    }

    public class UncompleteChallengeRequest
    {
        public int ChallengeId { get; set; }
    }

    public class CompleteChallengeRequest
    {
        public int ChallengeId { get; set; }
        public string? Notes { get; set; }
    }
}
