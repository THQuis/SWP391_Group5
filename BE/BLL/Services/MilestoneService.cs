using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Smoking.BLL.Models;
using Smoking.BLL.Interfaces;



namespace Smoking.BLL.Services
{
    public class MilestoneService : IMilestoneService
    {
        private readonly IMilestoneRepository _repo;

        public MilestoneService(IMilestoneRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<MilestoneGroupDTO>> GetGroupedMilestonesAsync()
        {
            var data = await _repo.GetMilestonesWithGroupsAsync();

            return data
                .GroupBy(m => m.MilestoneGroup.GroupName)
                .Select(g => new MilestoneGroupDTO
                {
                    GroupName = g.Key,
                    Milestones = g.Select(m => new MilestoneDTO
                    {
                        Name = m.Name,
                        Description = m.Description,
                        Time = m.TimeUnit == "phút" && m.MilestoneTime >= 60
                            ? $"{m.MilestoneTime / 60} giờ"
                            : $"{m.MilestoneTime} phút",
                        Percent = m.Percent
                    }).ToList()
                }).ToList();
        }
    }
}
    