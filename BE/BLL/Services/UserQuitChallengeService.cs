using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;

public class UserQuitChallengeService : IUserQuitChallengeService
{
    private readonly IUnitOfWork _unitOfWork;

    public UserQuitChallengeService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task GenerateChallengesAsync(int quitPlanId, int userId, DateTime startDate)
    {
        var templates = await _unitOfWork.QuitChallengeTemplates.GetAllTemplatesAsync();

        var existing = await _unitOfWork.UserQuitChallenges
            .FindAsync(c => c.UserId == userId && c.QuitPlanId == quitPlanId);

        var existingTemplateIds = existing.Select(c => c.TemplateId).ToHashSet();

        var newChallenges = templates
            .Where(t => !existingTemplateIds.Contains(t.Id))
            .Select(t => new UserQuitChallenge
            {
                UserId = userId,
                QuitPlanId = quitPlanId,
                TemplateId = t.Id,
                ChallengeDate = startDate.AddDays(t.DayOffset),
                ScheduledDate = DateTime.UtcNow,
                IsCompleted = false,
                Notes = null,
                ImageUrl = null
            }).ToList();

        if (newChallenges.Any())
        {
            await _unitOfWork.UserQuitChallenges.AddRangeAsync(newChallenges);
            await _unitOfWork.CompleteAsync();
        }
    }

    public async Task<List<UserQuitChallenge>> GetChallengesForWeekAsync(int userId, DateTime startOfWeek)
    {
        var endOfWeek = startOfWeek.AddDays(6);
        return await _unitOfWork.UserQuitChallenges.GetChallengesForUserAsync(userId, startOfWeek, endOfWeek);
    }

    public async Task MarkAsCompletedAsync(int challengeId, string? notes, string? imageUrl)
    {
        var challenge = await _unitOfWork.UserQuitChallenges.GetByIdAsync(challengeId);
        if (challenge == null)
            throw new Exception("Thử thách không tồn tại.");

        var allChallenges = await _unitOfWork.UserQuitChallenges
            .FindIncludingAsync2(
                c => c.UserId == challenge.UserId && c.QuitPlanId == challenge.QuitPlanId,
                c => c.Template
            );

        var ordered = allChallenges
            .Where(c => c.Template.Stage == challenge.Template.Stage)
            .OrderBy(c => c.ChallengeDate)
            .ToList();

        var index = ordered.FindIndex(c => c.Id == challengeId);
        if (index > 0)
        {
            var previous = ordered[index - 1];
            if (!previous.IsCompleted && previous.ChallengeDate < DateTime.Today)
                throw new Exception("Bạn phải hoàn thành thử thách hôm trước trước khi thực hiện thử thách hôm nay.");
        }

        if (challenge.ChallengeDate > DateTime.Today)
            throw new Exception("Chưa đến ngày thực hiện thử thách này.");

        challenge.IsCompleted = true;
        challenge.Notes = notes;
        challenge.ImageUrl = imageUrl;

        await _unitOfWork.CompleteAsync();
    }

    public async Task UnmarkAsCompletedAsync(int challengeId)
    {
        var challenge = await _unitOfWork.UserQuitChallenges.GetByIdAsync(challengeId);
        if (challenge == null)
            throw new Exception("Thử thách không tồn tại.");

        var allChallenges = await _unitOfWork.UserQuitChallenges
            .FindIncludingAsync2(
                c => c.UserId == challenge.UserId && c.QuitPlanId == challenge.QuitPlanId,
                c => c.Template
            );

        var ordered = allChallenges
            .Where(c => c.Template.Stage == challenge.Template.Stage)
            .OrderBy(c => c.ChallengeDate)
            .ToList();

        var index = ordered.FindIndex(c => c.Id == challengeId);
        if (index >= 0)
        {
            for (int i = index; i < ordered.Count; i++)
            {
                ordered[i].IsCompleted = false;
                ordered[i].Notes = null;
                ordered[i].ImageUrl = null;
            }

            await _unitOfWork.CompleteAsync();
        }
        else
        {
            throw new Exception("Không tìm thấy thử thách trong danh sách.");
        }
    }

    public async Task<int> AssignChallengesToUserAsync(int userId, int stage)
    {
        var quitPlan = await _unitOfWork.QuitPlans.GetLatestByUserIdAsync(userId);
        if (quitPlan == null)
            throw new InvalidOperationException("Người dùng chưa có kế hoạch cai thuốc.");

        var startDate = quitPlan.StartDate.Date;

        var templates = await _unitOfWork.QuitChallengeTemplates
            .FindAsync(t => t.Stage == stage);

        var existing = await _unitOfWork.UserQuitChallenges
            .FindAsync(c => c.UserId == userId && c.QuitPlanId == quitPlan.QuitPlanID);

        var existingTemplateIds = existing.Select(e => e.TemplateId).ToHashSet();

        var newChallenges = templates
            .Where(t => !existingTemplateIds.Contains(t.Id))
            .Select(t => new UserQuitChallenge
            {
                UserId = userId,
                QuitPlanId = quitPlan.QuitPlanID,
                TemplateId = t.Id,
                ChallengeDate = startDate.AddDays(t.DayOffset),
                ScheduledDate = DateTime.UtcNow,
                IsCompleted = false,
                Notes = null,
                ImageUrl = null
            }).ToList();

        if (newChallenges.Any())
        {
            await _unitOfWork.UserQuitChallenges.AddRangeAsync(newChallenges);
            await _unitOfWork.CompleteAsync();
        }

        return newChallenges.Count;
    }

    public async Task<List<UserQuitChallenge>> GetProgressiveChallengesForWeekAsync(int userId, DateTime weekStart, int stage)
    {
        var endOfWeek = weekStart.AddDays(6);
        var today = DateTime.Today;

        var allChallenges = await _unitOfWork.UserQuitChallenges
            .FindIncludingAsync2(
                c => c.UserId == userId
                      && c.ChallengeDate >= weekStart
                      && c.ChallengeDate <= endOfWeek
                      && c.Template.Stage == stage,
                c => c.Template
            );

        var ordered = allChallenges.OrderBy(c => c.ChallengeDate).ToList();
        var result = new List<UserQuitChallenge>();

        foreach (var challenge in ordered)
        {
            if (result.Count == 0)
            {
                result.Add(challenge);
            }
            else
            {
                var prev = result.Last();
                if (prev.IsCompleted && challenge.ChallengeDate <= today)
                {
                    result.Add(challenge);
                }
                else
                {
                    break;
                }
            }
        }

        return result;
    }

    public async Task<IEnumerable<UserQuitChallenge>> GetChallengesForStageAsync(int userId, int stage)
    {
        return await _unitOfWork.UserQuitChallenges
            .GetByUserIdAndStageAsync(userId, stage);
    }
}
