using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class BlogService : IBlogService
    {
        private readonly IUnitOfWork _unitOfWork;

        public BlogService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Blog> CreateAsync(Blog entity)
        {
            await _unitOfWork.Blogs.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.Blogs.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<Blog>> GetAllAsync()
        {
            return await _unitOfWork.Blogs.GetAllAsync();
        }

        public async Task<IEnumerable<Blog>> GetByAuthorIdAsync(int authorId)
        {
            return await _unitOfWork.Blogs.GetByAuthorIdAsync(authorId);
        }

        public async Task<Blog> GetByIdAsync(int id)
        {
            return await _unitOfWork.Blogs.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(Blog entity)
        {
            var existing = await _unitOfWork.Blogs.GetByIdAsync(entity.BlogId);
            if (existing == null)
                return false;

            existing.Title = entity.Title;
            existing.Content = entity.Content;
            existing.CategoryName = entity.CategoryName;
            existing.LastModifiedDate = entity.LastModifiedDate;
            existing.Status = entity.Status;
            existing.Likes = entity.Likes;
            existing.Dislikes = entity.Dislikes;

            _unitOfWork.Blogs.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
