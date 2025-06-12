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
    /// Triển khai các method truy vấn Blog cho admin (kèm User/Role)
    /// </summary>
    public class BlogRepository : IBlogRepository
    {
        private readonly AppDbContext _context;
        public BlogRepository(AppDbContext context) => _context = context;

        // Lấy tất cả blog, kèm User + Role
        public async Task<IEnumerable<Blog>> GetAllWithUserAndRoleAsync()
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .ToListAsync();
        }

        // Lấy blog theo trạng thái (Pending, Approved...), kèm User + Role
        public async Task<IEnumerable<Blog>> GetAllByStatusWithUserAndRoleAsync(string status)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .Where(b => b.Status == status)
                .ToListAsync();
        }

        // Lấy tất cả blog bị báo cáo, kèm User + Role
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
        {
            return await _context.Blogs.CountAsync(b => b.Status == status);
        }

        // Đếm blog bị báo cáo
        public async Task<int> CountReportedAsync()
        {
            return await _context.Blogs.CountAsync(b => b.ReportCount > 0);
        }

        // Đếm tổng số blog
        public async Task<int> CountAllAsync()
        {
            return await _context.Blogs.CountAsync();
        }

        // Lấy blog theo Id, kèm User + Role
        public async Task<Blog> GetByIdWithUserAndRoleAsync(int id)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(b => b.BlogId == id);
        }

        // Lấy blog theo tác giả (User)
        public async Task<IEnumerable<Blog>> GetByAuthorIdWithUserAndRoleAsync(int authorId)
        {
            return await _context.Blogs
                .Include(b => b.User)
                .ThenInclude(u => u.Role)
                .Where(b => b.AuthorId == authorId)
                .ToListAsync();
        }

        // Thêm mới blog
        public async Task AddAsync(Blog blog)
        {
            await _context.Blogs.AddAsync(blog);
        }

        // Update blog
        public void Update(Blog blog)
        {
            _context.Blogs.Update(blog);
        }

        // Xóa blog
        public void Delete(Blog blog)
        {
            _context.Blogs.Remove(blog);
        }

        // Lưu thay đổi
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
