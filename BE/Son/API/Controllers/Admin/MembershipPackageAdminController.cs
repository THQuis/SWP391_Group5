using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.Admin;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/membership-packages")]
    [Authorize(Roles = "1")] // Chỉ Admin (RoleID = 1) được phép
    public class MembershipPackageAdminController : ControllerBase
    {
        private readonly IMembershipPackageService _membershipService;

        public MembershipPackageAdminController(IMembershipPackageService membershipService)
        {
            _membershipService = membershipService;
        }

        // [GET] Lấy danh sách tất cả gói thành viên
        [HttpGet("list")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _membershipService.GetAllAsync();
            return Ok(result);
        }

        // [GET] Lấy chi tiết 1 gói theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _membershipService.GetByIdAsync(id);
            if (result == null)
                return NotFound(new { Message = "Không tìm thấy gói thành viên." });

            return Ok(result);
        }

        // [POST] Tạo mới gói thành viên
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] MembershipPackageCreateRequest request)
        {
            var newPackage = new MembershipPackage
            {
                PackageName = request.PackageName,
                PackageType = request.PackageType,
                Description = request.Description,
                Price = request.Price,
                Duration = request.Duration
            };

            var result = await _membershipService.CreateAsync(newPackage);
            return Ok(result);
        }

        // [PUT] Cập nhật thông tin gói thành viên
        [HttpPut("update")]
        public async Task<IActionResult> Update(int id, [FromBody] MembershipPackageUpdateRequest request)
        {
            var updated = new MembershipPackage
            {
                PackageID = id,
                PackageName = request.PackageName,
                PackageType = request.PackageType,
                Description = request.Description,
                Price = request.Price,
                Duration = request.Duration
            };

            var success = await _membershipService.UpdateAsync(updated);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy gói thành viên." });

            return Ok(new { Message = "Cập nhật gói thành viên thành công." });
        }

        // [DELETE] Xoá gói thành viên
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _membershipService.DeleteAsync(id);
            if (!success)
                return NotFound(new { Message = "Không tìm thấy gói để xoá." });

            return Ok(new { Message = "Xoá thành công." });
        }
    }
}
