using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> GetByIdAsync(object id);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task AddAsync(T entity);
        Task Update(T entity);  // Phải có kiểu trả về là Task
        Task Remove(T entity);  // Phải có kiểu trả về là Task
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
    }
}
