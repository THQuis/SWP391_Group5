using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Smoking.API.Models.User;

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
                return Ok(new
                {
                    success = false,
                    message = "Giai đoạn này đã được nhận trước đó. Vui lòng kiểm tra danh sách thử thách."
                });
            }

            return Ok(new
            {
                success = true,
                message = $"Bạn đã nhận thành công {count} thử thách cho giai đoạn {stage}."
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
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
        string stageTitle = ordered.FirstOrDefault()?.Template.StageTitle ?? $"Giai đoạn {stage}";

        for (int i = 0; i < ordered.Count; i++)
        {
            var challenge = ordered[i];
            bool isLocked = false;

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
                ImageUrl = challenge.ImageUrl,
                IsLocked = isLocked
            });
        }

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
                message = "🔒 Thử thách hôm nay chưa được mở. Hãy hoàn thành thử thách hôm trước.";
            }
            else
            {
                message = todayChallenge.IsCompleted
                    ? "✅ Bạn đã hoàn thành thử thách hôm nay!"
                    : "📌 Hôm nay bạn có thử thách mới cần hoàn thành.";
            }
        }
        else
        {
            message = "📅 Hôm nay không có thử thách nào.";
        }

        return Ok(new
        {
            stage,
            stageTitle,
            message,
            data = result
        });
    }


    [HttpPost("complete")]
    public async Task<IActionResult> CompleteChallenge([FromForm] CompleteChallengeForm request)
    {
        try
        {
            string? imageUrl = null;

            if (request.Image != null && request.Image.Length > 0)
            {
                var fileName = $"{Guid.NewGuid()}_{request.Image.FileName}";
                var folderPath = Path.Combine("wwwroot", "uploads", "challenge-images");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.Image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/challenge-images/{fileName}";
            }

            await _challengeService.MarkAsCompletedAsync(request.ChallengeId, request.Notes, imageUrl);

            return Ok(new
            {
                success = true,
                imageUrl,
                message = "🎉 Đánh dấu hoàn thành thử thách thành công!"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = $"❌ Không thể hoàn thành thử thách: {ex.Message}"
            });
        }
    }

    [HttpPost("uncomplete")]
    public async Task<IActionResult> UncompleteChallenge([FromBody] UncompleteChallengeRequest request)
    {
        await _challengeService.UnmarkAsCompletedAsync(request.ChallengeId);
        return Ok(new
        {
            success = true,
            message = "✅ Đã huỷ trạng thái hoàn thành của thử thách."
        });
    }

    [HttpGet("{userId}/all")]
    public async Task<IActionResult> GetAllChallengesGroupedByStage(int userId)
    {
        var userChallenges = await _challengeService.GetAllChallengesAsync(userId);
        var groupedByStage = userChallenges
            .GroupBy(c => c.Template.Stage)
            .ToDictionary(g => g.Key, g => g.ToList());

        var allTemplates = await _challengeService.GetAllTemplatesAsync();
        var allStages = allTemplates.Select(t => t.Stage).Distinct().OrderBy(s => s).ToList();

        var result = new List<object>();

        foreach (var stage in allStages)
        {
            var stageTitle = allTemplates.FirstOrDefault(t => t.Stage == stage)?.StageTitle ?? $"Giai đoạn {stage}";

            if (groupedByStage.ContainsKey(stage))
            {
                var challenges = groupedByStage[stage];
                result.Add(new
                {
                    Stage = stage,
                    StageTitle = stageTitle,
                    StageStatus = "✅ Đã nhận",
                    Challenges = challenges.Select(c => new
                    {
                        c.Id,
                        Title = c.Template.Title,
                        Description = c.Template.Description,
                        c.ChallengeDate,
                        c.IsCompleted,
                        c.Notes,
                        c.ImageUrl,
                        IsLocked = false
                    }).ToList()
                });
            }
            else
            {
                var templates = allTemplates.Where(t => t.Stage == stage).OrderBy(t => t.DayOffset).ToList();
                result.Add(new
                {
                    Stage = stage,
                    StageTitle = stageTitle,
                    StageStatus = "🔒 Chưa nhận. Hãy nhận để bắt đầu.",
                    Challenges = templates.Select(t => new
                    {
                        Id = 0,
                        Title = t.Title,
                        Description = t.Description,
                        ChallengeDate = (DateTime?)null,
                        IsCompleted = false,
                        Notes = (string?)null,
                        ImageUrl = (string?)null,
                        IsLocked = true
                    }).ToList()
                });
            }
        }

        return Ok(new { success = true, data = result });
    }
}
