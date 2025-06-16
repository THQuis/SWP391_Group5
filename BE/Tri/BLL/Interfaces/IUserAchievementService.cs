using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IUserAchievementService
    {
        Task<bool> GrantAchievementAsync(int userId, int achievementId, bool sendEmail = true);
    }

}
