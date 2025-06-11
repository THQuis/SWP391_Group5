using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Smoking.API.Models.Blog;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using Smoking.BLL.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.API.Controllers
{
    [Route("api/blogs")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public BlogController(IUnitOfWork unitOfWork)
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
        [Authorize]  // Đảm bảo chỉ người đã đăng nhập mới có thể tạo bài viết
        public async Task<IActionResult> CreateBlog([FromBody] BlogRequest request)
        {
            try
            {
                // Lấy userId từ claims trong JWT token
                var userId = int.Parse(User.FindFirst("nameid")?.Value);

                var blog = new Blog
                {
                    AuthorId = userId,  
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
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // Chỉnh sửa bài viết
        [HttpPut("update/{blogId}")]
        [Authorize]
        public async Task<IActionResult> UpdateBlog(int blogId, [FromBody] BlogRequest request)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(blogId);
            if (blog == null)
            {
                return NotFound(new { Message = "Bài viết không tồn tại." });
            }

            // Kiểm tra nếu người dùng là tác giả của bài viết
            var userId = int.Parse(User.FindFirst("nameid")?.Value);
            if (blog.AuthorId != userId)
            {
                return Unauthorized(new { Message = "Bạn không có quyền chỉnh sửa bài viết này." });
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
        [Authorize]
        public async Task<IActionResult> DeleteBlog(int blogId)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(blogId);
            if (blog == null)
            {
                return NotFound(new { Message = "Bài viết không tồn tại." });
            }

            // Kiểm tra nếu người dùng là tác giả của bài viết
            var userId = int.Parse(User.FindFirst("nameid")?.Value);
            if (blog.AuthorId != userId)
            {
                return Unauthorized(new { Message = "Bạn không có quyền xóa bài viết này." });
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
