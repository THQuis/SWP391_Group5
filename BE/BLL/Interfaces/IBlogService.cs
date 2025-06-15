using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    /// <summary>
    /// Service cho nghiệp vụ blog (tầng logic, gọi repository)
    /// </summary>
    public interface IBlogService
    {
        // Lấy tất cả, kèm User + Role
        Task<IEnumerable<Blog>> GetAllWithUserAndRoleAsync();

        // Lấy blog theo trạng thái (Pending, Approved...), kèm User + Role
        Task<IEnumerable<Blog>> GetAllByStatusWithUserAndRoleAsync(string status);

        // Lấy tất cả blog bị báo cáo, kèm User + Role
        Task<IEnumerable<Blog>> GetAllReportedWithUserAndRoleAsync();

        // Đếm số lượng blog
        Task<int> CountAllAsync();
        Task<int> CountByStatusAsync(string status);
        Task<int> CountReportedAsync();

        // Duyệt, từ chối, xử lý báo cáo, xóa blog
        Task<bool> ApproveBlogAsync(int blogId);
        Task<bool> RejectBlogAsync(int blogId);
        Task<bool> MarkBlogAsReviewedAsync(int blogId);
        Task<bool> DeleteAsync(int blogId);

        // Admin tạo blog
        Task<Blog> CreateByAdminAsync(Blog blog);
    }
}
