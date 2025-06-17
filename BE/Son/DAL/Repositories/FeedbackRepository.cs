using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class FeedbackRepository : GenericRepository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(AppDbContext context) : base(context)
        {
        }

        // Lấy tất cả feedback của người dùng
        public async Task<IEnumerable<Feedback>> GetByUserIdAsync(int userId)
        {
            return await _context.Feedbacks
                                 .Where(f => f.UserID == userId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        // Cập nhật thông tin Feedback
        public async Task Update(Feedback entity)
        {
            _context.Feedbacks.Update(entity);
            await _context.SaveChangesAsync();
        }

        // Xóa Feedback
        public async Task Remove(Feedback entity)
        {
            _context.Feedbacks.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
