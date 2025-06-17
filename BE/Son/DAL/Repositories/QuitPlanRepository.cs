using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class QuitPlanRepository : GenericRepository<QuitPlan>, IQuitPlanRepository
    {
        public QuitPlanRepository(AppDbContext context) : base(context)
        {
        }

        // Lấy tất cả các QuitPlan của một người dùng
        public async Task<IEnumerable<QuitPlan>> GetByUserIdAsync(int userId)
        {
            return await _context.QuitPlans
                                 .Where(q => q.UserID == userId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        // Cập nhật thông tin QuitPlan
        public async Task Update(QuitPlan entity)
        {
            _context.QuitPlans.Update(entity); // Cập nhật QuitPlan
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }

        // Xóa QuitPlan
        public async Task Remove(QuitPlan entity)
        {
            _context.QuitPlans.Remove(entity); // Xóa QuitPlan
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }
    }
}
