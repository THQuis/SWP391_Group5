using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;

namespace Smoking.DAL.Repositories
{
    public class MembershipPackageRepository : GenericRepository<MembershipPackage>, IMembershipPackageRepository
    {
        public MembershipPackageRepository(AppDbContext context) : base(context)
        {
        }

        // Phương thức tìm gói theo tên
        public async Task<MembershipPackage> GetPackageByNameAsync(string packageName)
        {
            return await _context.MembershipPackages
                .FirstOrDefaultAsync(p => p.PackageName.Equals(packageName, StringComparison.OrdinalIgnoreCase));
        }
    }
}
