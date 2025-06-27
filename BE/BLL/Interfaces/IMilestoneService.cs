using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Smoking.BLL.Models;


namespace Smoking.BLL.Interfaces
{
    public interface IMilestoneService
    {
        Task<List<MilestoneGroupDTO>> GetGroupedMilestonesAsync();
    }
}