using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    /// <summary>
    /// Triển khai repository cho bảng Blog (cho Admin + User)
    /// </summary>
    public class BlogRepository : IBlogRepository
    {
        private readonly AppDbContext _context;
        public BlogRepository(AppDbContext context) => _context = context;

        // ================= ADMIN =================

        // Lấy toàn bộ blog kèm User + Role
        public async Task<IEnumerable<Blog>> GetAllWithUserAndRoleAsync()
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .ToListAsync();
        }

        // Lấy blog theo trạng thái kèm User + Role
        public async Task<IEnumerable<Blog>> GetAllByStatusWithUserAndRoleAsync(string status)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .Where(b => b.Status == status)
                .ToListAsync();
        }

        // Lấy blog bị báo cáo kèm User + Role
        public async Task<IEnumerable<Blog>> GetAllReportedWithUserAndRoleAsync()
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .Where(b => b.ReportCount > 0)
                .ToListAsync();
        }

        // Đếm blog theo trạng thái
        public async Task<int> CountByStatusAsync(string status)
            => await _context.Blogs.CountAsync(b => b.Status == status);

        // Đếm blog bị báo cáo
        public async Task<int> CountReportedAsync()
            => await _context.Blogs.CountAsync(b => b.ReportCount > 0);

        // Đếm tổng số blog hệ thống
        public async Task<int> CountAllAsync()
            => await _context.Blogs.CountAsync();

        // Lấy blog theo id kèm User + Role (cho admin duyệt)
        public async Task<Blog> GetByIdWithUserAndRoleAsync(int id)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(b => b.BlogId == id);
        }

        // Get blogs by AuthorId, including User and Role
        public async Task<IEnumerable<Blog>> GetByAuthorIdWithUserAndRoleAsync(int authorId)
        {
            return await _context.Blogs
                .Include(b => b.User)  // Ensure User is eagerly loaded
                .ThenInclude(u => u.Role)  // Ensure Role is eagerly loaded
                .Where(b => b.AuthorId == authorId)
                .ToListAsync();
        }


        // ================= USER =================

        // Lấy toàn bộ blog của user
        public async Task<IEnumerable<Blog>> GetAllByUserIdAsync(int userId)
        {
            return await _context.Blogs
                .Where(b => b.AuthorId == userId)
                .ToListAsync();
        }

        // Lấy chi tiết blog theo id (không kèm User + Role)
        public async Task<Blog> GetByIdAsync(int blogId)
        {
            return await _context.Blogs
                .FirstOrDefaultAsync(b => b.BlogId == blogId);
        }

        // Đếm tổng số blog của user
        public async Task<int> CountAllByUserAsync(int userId)
            => await _context.Blogs.CountAsync(b => b.AuthorId == userId);

        // Đếm số blog của user theo trạng thái
        public async Task<int> CountByUserAndStatusAsync(int userId, string status)
            => await _context.Blogs.CountAsync(b => b.AuthorId == userId && b.Status == status);


        // ================= COMMON =================

        public async Task AddAsync(Blog blog)
        {
            await _context.Blogs.AddAsync(blog);
        }

        public void Update(Blog blog)
        {
            _context.Blogs.Update(blog);
        }

        public void Delete(Blog blog)
        {
            _context.Blogs.Remove(blog);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
