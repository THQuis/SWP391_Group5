using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IBlogService
    {
        Task<IEnumerable<Blog>> GetAllAsync();
        Task<Blog> GetByIdAsync(int id);
        Task<IEnumerable<Blog>> GetByAuthorIdAsync(int authorId);
        Task<Blog> CreateAsync(Blog entity);
        Task<bool> UpdateAsync(Blog entity);
        Task<bool> DeleteAsync(int id);
    }
}
