using Smoking.DAL.Entities;
using Smoking.DAL.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IQuitChallengeTemplateService
    {
        Task<List<QuitChallengeTemplate>> GetAllTemplatesAsync();
    }
}
