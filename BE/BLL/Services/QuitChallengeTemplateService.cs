using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
   

namespace Smoking.BLL.Services
{
    public class QuitChallengeTemplateService : IQuitChallengeTemplateService
    {
        private readonly IQuitChallengeTemplateRepository _templateRepo;

        public QuitChallengeTemplateService(IQuitChallengeTemplateRepository templateRepo)
        {
            _templateRepo = templateRepo;
        }

        public async Task<List<QuitChallengeTemplate>> GetAllTemplatesAsync()
        {
            return await _templateRepo.GetAllTemplatesAsync();
        }
    }

}
