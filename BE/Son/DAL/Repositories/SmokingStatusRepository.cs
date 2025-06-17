using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class SmokingStatusRepository : GenericRepository<SmokingStatus>, ISmokingStatusRepository
    {
        public SmokingStatusRepository(AppDbContext context) : base(context)
        {
        }

        // Phương thức lấy các trạng thái hút thuốc của người dùng
        public async Task<IEnumerable<SmokingStatus>> GetByUserIdAsync(int userId)
        {
            return await _context.SmokingStatuses
                                 .Where(s => s.UserID == userId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        // Cài đặt phương thức Update cho SmokingStatus
        public async Task Update(SmokingStatus entity)
        {
            _context.SmokingStatuses.Update(entity); // Cập nhật trạng thái hút thuốc
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }

        // Cài đặt phương thức Remove cho SmokingStatus
        public async Task Remove(SmokingStatus entity)
        {
            _context.SmokingStatuses.Remove(entity); // Xóa trạng thái hút thuốc
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }
    }
}
