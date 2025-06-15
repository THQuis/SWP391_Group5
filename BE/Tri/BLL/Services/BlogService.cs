using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    /// <summary>
    /// Xử lý nghiệp vụ blog cho admin (gọi repository, xử lý logic)
    /// </summary>
    public class BlogService : IBlogService
    {
        private readonly IBlogRepository _repo;
        public BlogService(IBlogRepository repo) => _repo = repo;

        public async Task<IEnumerable<Blog>> GetAllWithUserAndRoleAsync()
            => await _repo.GetAllWithUserAndRoleAsync();

        public async Task<IEnumerable<Blog>> GetAllByStatusWithUserAndRoleAsync(string status)
            => await _repo.GetAllByStatusWithUserAndRoleAsync(status);

        public async Task<IEnumerable<Blog>> GetAllReportedWithUserAndRoleAsync()
            => await _repo.GetAllReportedWithUserAndRoleAsync();

        public async Task<int> CountAllAsync() => await _repo.CountAllAsync();
        public async Task<int> CountByStatusAsync(string status) => await _repo.CountByStatusAsync(status);
        public async Task<int> CountReportedAsync() => await _repo.CountReportedAsync();

        // Duyệt blog
        public async Task<bool> ApproveBlogAsync(int blogId)
        {
            var blog = await _repo.GetByIdWithUserAndRoleAsync(blogId);
            if (blog == null) return false;
            blog.Status = "Approved";
            _repo.Update(blog);
            await _repo.SaveChangesAsync();
            return true;
        }

        // Từ chối blog
        public async Task<bool> RejectBlogAsync(int blogId)
        {
            var blog = await _repo.GetByIdWithUserAndRoleAsync(blogId);
            if (blog == null) return false;
            blog.Status = "Rejected";
            _repo.Update(blog);
            await _repo.SaveChangesAsync();
            return true;
        }

        // Đánh dấu đã xử lý báo cáo
        public async Task<bool> MarkBlogAsReviewedAsync(int blogId)
        {
            var blog = await _repo.GetByIdWithUserAndRoleAsync(blogId);
            if (blog == null) return false;
            blog.ReportCount = 0;
            _repo.Update(blog);
            await _repo.SaveChangesAsync();
            return true;
        }

        // Xóa blog
        public async Task<bool> DeleteAsync(int blogId)
        {
            var blog = await _repo.GetByIdWithUserAndRoleAsync(blogId);
            if (blog == null) return false;
            _repo.Delete(blog);
            await _repo.SaveChangesAsync();
            return true;
        }

        // Admin tạo blog mới
        public async Task<Blog> CreateByAdminAsync(Blog blog)
        {
            blog.Status = "Approved";
            blog.CreatedDate = System.DateTime.Now;
            await _repo.AddAsync(blog);
            await _repo.SaveChangesAsync();
            return blog;
        }
    }
}
