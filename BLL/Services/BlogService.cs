using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
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

        public async Task<IEnumerable<Blog>> GetAllAsync()
        {
            return await _unitOfWork.Blogs.GetAllAsync();
        }

        public async Task<Blog> GetByIdAsync(int id)
        {
            return await _unitOfWork.Blogs.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Blog>> GetByAuthorIdAsync(int authorId)
        {
            return await _unitOfWork.Blogs.GetByAuthorIdAsync(authorId);
        }

        public async Task<Blog> CreateAsync(Blog entity)
        {
            entity.CreatedDate = DateTime.Now;
            entity.LastModifiedDate = DateTime.Now;
            entity.Status = "Draft"; // Mặc định khi tạo mới
            entity.Likes = 0;
            entity.Dislikes = 0;

            await _unitOfWork.Blogs.AddAsync(entity);
            await _unitOfWork.CompleteAsync(); // Lưu thay đổi vào DB
            return entity;
        }

        public async Task<bool> UpdateAsync(Blog entity)
        {
            var existingBlog = await _unitOfWork.Blogs.GetByIdAsync(entity.BlogId);
            if (existingBlog == null)
            {
                return false; // Không tìm thấy blog để cập nhật
            }

            // Cập nhật các thuộc tính
            existingBlog.Title = entity.Title;
            existingBlog.Content = entity.Content;
            existingBlog.CategoryName = entity.CategoryName;
            existingBlog.Status = entity.Status;
            existingBlog.LastModifiedDate = DateTime.Now; // Cập nhật thời gian sửa đổi

            _unitOfWork.Blogs.Update(existingBlog);
            await _unitOfWork.CompleteAsync(); // Lưu thay đổi vào DB
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null)
            {
                return false; // Không tìm thấy blog để xóa
            }

            _unitOfWork.Blogs.Remove(blog);
            await _unitOfWork.CompleteAsync(); // Lưu thay đổi vào DB
            return true;
        }
    }
}