using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/user-memberships")]
    [Authorize(Roles = "2")] // Chỉ cho phép tài khoản Member (RoleID = 2)
    public class UserMembershipController : ControllerBase
    {
        private readonly IUserMembershipService _userMembershipService;

        public UserMembershipController(IUserMembershipService userMembershipService)
        {
            _userMembershipService = userMembershipService;
        }

        // [GET] Lấy tất cả các gói thành viên đã đăng ký (chỉ để test)
        [HttpGet("List")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _userMembershipService.GetAllAsync();
            return Ok(result);
        }

        // [GET] Lấy danh sách gói đã đăng ký của một user cụ thể
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var result = await _userMembershipService.GetByUserIdAsync(userId);
            return Ok(result);
        }

        // [POST] Đăng ký gói thành viên mới
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserMembership request)
        {
            // Lấy ID của user đang đăng nhập từ JWT
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            request.UserID = userId;

            // Gán ngày bắt đầu là hiện tại, ngày kết thúc dựa theo thời hạn của gói
            request.StartDate = DateTime.Now;
            request.EndDate = request.StartDate.AddMonths(request.Package.Duration);

            // Nếu là gói miễn phí thì đánh dấu là "Đã thanh toán"
            request.PaymentStatus = request.Package.Price == 0 ? "Paid" : "Pending";

            var result = await _userMembershipService.CreateAsync(request);
            return Ok(result);
        }

        // [PUT] Cập nhật thông tin đăng ký gói thành viên
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UserMembership update)
        {
            update.UserMembershipID = id;
            var success = await _userMembershipService.UpdateAsync(update);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy gói đã đăng ký." });

            return Ok(new { Message = "Cập nhật thành công." });
        }

        // [DELETE] Xoá đăng ký gói thành viên theo ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _userMembershipService.DeleteAsync(id);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy gói đã đăng ký." });

            return Ok(new { Message = "Xoá thành công." });
        }
    }
}
