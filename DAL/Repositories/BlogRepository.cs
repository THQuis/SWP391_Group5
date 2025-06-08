using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Blog>> GetByAuthorIdAsync(int authorId)
        {
            return await _context.Blogs
                                 .Where(b => b.AuthorId == authorId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }
    }
}
