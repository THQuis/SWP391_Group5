using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.User
{
    [ApiController]
    [Route("api/user-memberships")]
    [Authorize(Roles = "2")] // RoleID = 2 => Member
    public class UserMembershipController : ControllerBase
    {
        private readonly IUserMembershipService _userMembershipService;
        private readonly IMembershipPackageService _packageService;

        public UserMembershipController(IUserMembershipService userMembershipService, IMembershipPackageService packageService)
        {
            _userMembershipService = userMembershipService;
            _packageService = packageService;
        }

        // [GET] Lấy tất cả các gói đang có
        [HttpGet("list")]
        public async Task<IActionResult> GetAllPackages()
        {
            var result = await _packageService.GetAllAsync();
            return Ok(result);
        }

        // [GET] Lấy gói hiện tại của user
        [HttpGet("use")]
        public async Task<IActionResult> GetCurrentPackage()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var list = await _userMembershipService.GetByUserIdAsync(userId);
            var latest = list.OrderByDescending(x => x.StartDate).FirstOrDefault();
            return latest == null ? NotFound(new { Message = "Bạn chưa đăng ký gói nào." }) : Ok(latest);
        }

        // [POST] Đăng ký gói mới
        [HttpPost("create")]
        public async Task<IActionResult> RegisterPackage([FromBody] RegisterMembershipRequest request)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var package = await _packageService.GetByIdAsync(request.PackageID);
            if (package == null)
                return NotFound(new { Message = "Gói không tồn tại." });

            DateTime start = DateTime.Now;
            DateTime end = start.AddMonths(package.Duration);

            var membership = new UserMembership
            {
                UserID = userId,
                PackageID = request.PackageID,
                StartDate = start,
                EndDate = end,
                PaymentStatus = "Pending"
            };

            var result = await _userMembershipService.CreateAsync(membership);
            return Ok(new { Message = "Đăng ký thành công.", Membership = result });
        }

        // [GET] Danh sách gói đã từng đăng ký
        [HttpGet("used")]
        public async Task<IActionResult> MyPackages()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _userMembershipService.GetByUserIdAsync(userId);
            return Ok(result);
        }
    }
}
