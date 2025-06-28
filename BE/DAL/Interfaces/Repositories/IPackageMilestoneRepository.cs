using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Smoking.DAL.Entities;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IPackageMilestoneRepository
    {
        Task<IEnumerable<PackageMilestone>> GetAllAsync();
        Task<PackageMilestone?> GetByIdAsync(int id);
        Task AddAsync(PackageMilestone entity);
        void Update(PackageMilestone entity);
        void Delete(PackageMilestone entity);
    }
}
