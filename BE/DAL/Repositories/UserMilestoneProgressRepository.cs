using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class UserMilestoneProgressRepository : IUserMilestoneProgressRepository
    {
        private readonly AppDbContext _context;

        public UserMilestoneProgressRepository(AppDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả tiến trình của người dùng
        public async Task<List<UserMilestoneProgress>> GetByUserIdAsync(int userId)
        {
            return await _context.UserMilestoneProgress
                .Where(up => up.UserID == userId)
                .Include(up => up.Milestone)  // Bao gồm Milestone
                .ThenInclude(m => m.PackageMilestones)  // Bao gồm PackageMilestones trong Milestone
                .ToListAsync();
        }

        // Lấy tiến trình theo ID
        public async Task<UserMilestoneProgress> GetByIdAsync(int id)
        {
            return await _context.UserMilestoneProgress
                .Include(up => up.Milestone)
                .FirstOrDefaultAsync(up => up.UserMilestoneID == id);
        }

        // Thêm tiến trình vào cơ sở dữ liệu
        public async Task AddAsync(UserMilestoneProgress userMilestoneProgress)
        {
            await _context.UserMilestoneProgress.AddAsync(userMilestoneProgress);  // Thêm tiến trình vào DbContext
            await _context.SaveChangesAsync();  // Lưu thay đổi vào cơ sở dữ liệu
        }
    }
}
