using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class MembershipPackageRepository : GenericRepository<MembershipPackage>, IMembershipPackageRepository
    {
        public MembershipPackageRepository(AppDbContext context) : base(context)
        {
        }

        // Phương thức cập nhật MembershipPackage
        public async Task Update(MembershipPackage entity)
        {
            _context.MembershipPackages.Update(entity);
            await _context.SaveChangesAsync();
        }

        // Phương thức xóa MembershipPackage
        public async Task Remove(MembershipPackage entity)
        {
            _context.MembershipPackages.Remove(entity);
            await _context.SaveChangesAsync();
        }

        // Các phương thức tìm kiếm hoặc truy vấn có thể thêm vào đây nếu cần
    }
}
