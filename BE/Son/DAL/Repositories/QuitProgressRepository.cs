using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class QuitProgressRepository : GenericRepository<QuitProgress>, IQuitProgressRepository
    {
        public QuitProgressRepository(AppDbContext context) : base(context)
        {
        }

        // Lấy tất cả các tiến trình từ một QuitPlan
        public async Task<IEnumerable<QuitProgress>> GetByQuitPlanIdAsync(int quitPlanId)
        {
            return await _context.QuitProgresses
                                 .Where(p => p.QuitPlanID == quitPlanId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        // Cập nhật thông tin tiến trình
        public async Task Update(QuitProgress entity)
        {
            _context.QuitProgresses.Update(entity); // Cập nhật tiến trình
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }

        // Xóa tiến trình
        public async Task Remove(QuitProgress entity)
        {
            _context.QuitProgresses.Remove(entity); // Xóa tiến trình
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }
    }
}
