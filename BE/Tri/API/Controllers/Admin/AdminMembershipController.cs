using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smoking.API.Models.Admin;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces;
using Smoking.DAL.Interfaces.Repositories;

namespace Smoking.API.Controllers.Admin
{
    [Route("api/admin/memberships")]
    [ApiController]
    [Authorize(Roles = "1")]
    public class AdminMembershipController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public AdminMembershipController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // ✅ Xem danh sách tất cả thành viên đã mua gói
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUserMemberships()
        {
            var memberships = await _unitOfWork.UserMemberships.GetAllWithIncludeAsync(includeProperties: "User,Package");

            var result = memberships.Select(m => new AdminUserMembershipDto
            {
                UserMembershipID = m.UserMembershipID,
                UserID = m.UserID,
                FullName = m.User.FullName,
                Email = m.User.Email,
                PackageName = m.Package.PackageName,
                StartDate = m.StartDate,
                EndDate = m.EndDate,
                PaymentStatus = m.PaymentStatus
            });

            return Ok(result);
        }

        // ✅ Admin cập nhật gói thành viên cho người dùng (không cần thanh toán)
        [HttpPost("assign")]
        public async Task<IActionResult> AssignMembershipToUser([FromBody] AdminUpdateMembershipDto dto)
        {
            var package = await _unitOfWork.MembershipPackages.GetByIdAsync(dto.PackageId);
            if (package == null) return NotFound("Không tìm thấy gói");

            var user = await _unitOfWork.Users.GetByIdAsync(dto.UserId);
            if (user == null) return NotFound("Không tìm thấy người dùng");

            var now = DateTime.Now;
            var end = package.Duration > 0
            ? now.AddMonths(package.Duration)
            : DateTime.MaxValue;

            var existing = await _unitOfWork.UserMemberships.GetActiveByUserIdAsync(dto.UserId);
            if (existing != null)
            {
                existing.PackageID = dto.PackageId;
                existing.StartDate = now;
                existing.EndDate = end;
                existing.PaymentStatus = "AdminAssigned";
                await _unitOfWork.UserMemberships.UpdateAsync(existing);
            }
            else
            {
                var newMembership = new UserMembership
                {
                    UserID = dto.UserId,
                    PackageID = dto.PackageId,
                    StartDate = now,
                    EndDate = end,
                    PaymentStatus = "AdminAssigned"
                };
                await _unitOfWork.UserMemberships.AddAsync(newMembership);
            }

            await _unitOfWork.CompleteAsync();
            return Ok(new { message = "Cập nhật thành công" });
        }

        // ✅ Xem danh sách tất cả các gói thành viên
        [HttpGet("packages")]
        public async Task<IActionResult> GetAllPackages()
        {
            var packages = await _unitOfWork.MembershipPackages.GetAllAsync();
            var userMemberships = await _unitOfWork.UserMemberships.GetAllAsync();

            var result = packages.Select(p => new AdminPackageWithCountDto
            {
                PackageId = p.PackageID,
                PackageName = p.PackageName,
                Duration = p.Duration,
                Price = p.Price,
                PurchasedCount = userMemberships.Count(m => m.PackageID == p.PackageID)
            }).ToList();

            return Ok(result);
        }

    }
}
