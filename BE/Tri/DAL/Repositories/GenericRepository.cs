using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    /// <summary>
    /// Implementation chung cho các thao tác CRUD cơ bản với EF Core
    /// </summary>
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<TEntity> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<TEntity>();
        }

        //Lấy toàn bộ dữ liệu
        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        //Lấy 1 entity theo ID
        public async Task<TEntity> GetByIdAsync(object id)
        {
            return await _dbSet.FindAsync(id);
        }

        //Lấy các entity theo điều kiện LINQ 
        public async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.AsNoTracking().Where(predicate).ToListAsync();
        }

        //Thêm mới 1 entity
        public async Task AddAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        //Cập nhật 1 entity
        public void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }

        //Xoá 1 entity
        public void Remove(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }
    }
}
