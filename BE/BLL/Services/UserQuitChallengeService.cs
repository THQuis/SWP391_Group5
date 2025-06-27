using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
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
                    Notes = null
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

        public async Task MarkAsCompletedAsync(int challengeId, string? notes)
        {
            var challenge = await _unitOfWork.UserQuitChallenges.GetByIdAsync(challengeId);
            if (challenge == null) return;

            challenge.IsCompleted = true;
            challenge.Notes = notes;

            await _unitOfWork.CompleteAsync();
        }

        public async Task<int> AssignChallengesToUserAsync(int userId, int stage)
        {
            var quitPlan = await _unitOfWork.QuitPlans.GetLatestByUserIdAsync(userId);
            if (quitPlan == null)
                throw new Exception("Người dùng chưa có kế hoạch cai thuốc.");

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
                    Notes = null
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
                if (challenge.ChallengeDate > today)
                    break; 

                if (result.Count == 0)
                {
                    result.Add(challenge); 
                }
                else
                {
                    var previous = result.Last();
                    if (previous.IsCompleted && previous.ChallengeDate < today)
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


    }
}
