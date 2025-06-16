using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Repository pattern cho Blog (quản lý cho cả Admin và User)
    /// </summary>
    public interface IBlogRepository
    {
        // ================= ADMIN =================

        Task<IEnumerable<Blog>> GetAllWithUserAndRoleAsync();
        Task<IEnumerable<Blog>> GetAllByStatusWithUserAndRoleAsync(string status);
        Task<IEnumerable<Blog>> GetAllReportedWithUserAndRoleAsync();
        Task<int> CountByStatusAsync(string status);
        Task<int> CountReportedAsync();
        Task<int> CountAllAsync();
        Task<Blog> GetByIdWithUserAndRoleAsync(int id);

        // ================= USER =================

        Task<IEnumerable<Blog>> GetAllByUserIdAsync(int userId);
        Task<Blog> GetByIdAsync(int blogId);
        Task<int> CountAllByUserAsync(int userId);
        Task<int> CountByUserAndStatusAsync(int userId, string status);

        // ================= COMMON =================

        Task AddAsync(Blog blog);
        void Update(Blog blog);
        void Delete(Blog blog);
        Task SaveChangesAsync();
    }
}
