using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.Blog;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Threading.Tasks;


namespace Smoking.API.Controllers
{
    [Route("api/blogs")]
    [ApiController]
    public class BlogUserController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BlogUserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Lấy tất cả bài viết của người dùng
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetBlogsByUser(int userId)
        {
            var blogs = await _unitOfWork.Blogs.GetByAuthorIdAsync(userId);
            return Ok(blogs);
        }

        // Tạo bài viết mới
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromBody] BlogRequest request)
        {
            var blog = new Blog
            {
                AuthorId = request.AuthorId,
                Title = request.Title,
                Content = request.Content,
                CategoryName = request.CategoryName,
                CreatedDate = DateTime.UtcNow,
                LastModifiedDate = DateTime.UtcNow,
                Status = "Active",
                Likes = 0,
                Dislikes = 0
            };

            await _unitOfWork.Blogs.AddAsync(blog);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Bài viết đã được tạo thành công." });
        }

        // Chỉnh sửa bài viết
        [HttpPut("update/{blogId}")]
        public async Task<IActionResult> UpdateBlog(int blogId, [FromBody] BlogRequest request)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(blogId);
            if (blog == null)
            {
                return NotFound(new { Message = "Bài viết không tồn tại." });
            }

            blog.Title = request.Title;
            blog.Content = request.Content;
            blog.CategoryName = request.CategoryName;
            blog.LastModifiedDate = DateTime.UtcNow;

            _unitOfWork.Blogs.Update(blog);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Bài viết đã được cập nhật thành công." });
        }

        // Xóa bài viết
        [HttpDelete("delete/{blogId}")]
        public async Task<IActionResult> DeleteBlog(int blogId)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(blogId);
            if (blog == null)
            {
                return NotFound(new { Message = "Bài viết không tồn tại." });
            }

            _unitOfWork.Blogs.Remove(blog);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Bài viết đã được xóa thành công." });
        }

        // Lấy chi tiết bài viết
        [HttpGet("{blogId}")]
        public async Task<IActionResult> GetBlogById(int blogId)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(blogId);
            if (blog == null)
            {
                return NotFound(new { Message = "Bài viết không tồn tại." });
            }

            return Ok(blog);
        }
    }
}