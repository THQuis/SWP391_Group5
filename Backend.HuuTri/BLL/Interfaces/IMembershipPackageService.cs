using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IMembershipPackageService
    {
        Task<IEnumerable<MembershipPackage>> GetAllAsync();
        Task<MembershipPackage> GetByIdAsync(int id);
        Task<MembershipPackage> CreateAsync(MembershipPackage entity);
        Task<bool> UpdateAsync(MembershipPackage entity);
        Task<bool> DeleteAsync(int id);
    }
}
