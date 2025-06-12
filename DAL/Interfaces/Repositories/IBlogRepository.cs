using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Repository pattern cho Blog, lấy được luôn User/Role
    /// </summary>
    public interface IBlogRepository
    {
        Task<IEnumerable<Blog>> GetAllWithUserAndRoleAsync();
        Task<IEnumerable<Blog>> GetAllByStatusWithUserAndRoleAsync(string status);
        Task<IEnumerable<Blog>> GetAllReportedWithUserAndRoleAsync();
        Task<int> CountByStatusAsync(string status);
        Task<int> CountReportedAsync();
        Task<int> CountAllAsync();
        Task<Blog> GetByIdWithUserAndRoleAsync(int id);
        Task<IEnumerable<Blog>> GetByAuthorIdWithUserAndRoleAsync(int authorId);
        Task AddAsync(Blog blog);
        void Update(Blog blog);
        void Delete(Blog blog);
        Task SaveChangesAsync();
    }
}
