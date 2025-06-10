using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Smoking.API.Controllers
{
    [ApiController]
    [Route("api/membership")]
    public class MembershipController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public MembershipController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 1️⃣ Lấy tất cả các gói thành viên
        [HttpGet("packages")]
        public async Task<IActionResult> GetAllPackages()
        {
            var packages = await _unitOfWork.MembershipPackages.GetAllAsync();
            return Ok(packages);
        }

        // 2️⃣ Lấy gói thành viên theo tên (Basic, Premium)
        [HttpGet("package/{name}")]
        public async Task<IActionResult> GetPackageByName(string name)
        {
            var package = await _unitOfWork.MembershipPackages.GetPackageByNameAsync(name);
            if (package == null)
                return NotFound(new { Message = "Gói không tồn tại." });

            return Ok(package);
        }

        // 3️⃣ Đăng ký gói thành viên cho người dùng
        [HttpPost("subscribe")]
        public async Task<IActionResult> SubscribePackage([FromBody] SubscribePackageRequest request)
        {
            // Lấy thông tin gói thành viên
            var package = await _unitOfWork.MembershipPackages.GetPackageByNameAsync(request.PackageName);
            if (package == null)
                return NotFound(new { Message = "Gói không tồn tại." });

            // Lấy UserID từ token
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);

            // Tạo đối tượng UserMembership để liên kết người dùng với gói
            var userMembership = new UserMembership
            {
                UserId = userId,
                PackageId = package.PackageID,
                StartDate = DateTime.UtcNow,
                EndDate = DateTime.UtcNow.AddMonths(package.Duration)  // Tính thời gian kết thúc dựa trên gói
            };

            // Thêm vào bảng UserMembership
            await _unitOfWork.UserMemberships.AddAsync(userMembership);
            await _unitOfWork.CompleteAsync();  // Lưu thay đổi vào DB

            return Ok(new { Message = $"Đăng ký thành công gói {package.PackageName}!" });
        }
    }

    // Request model để đăng ký gói
    public class SubscribePackageRequest
    {
        public string PackageName { get; set; }  // Tên gói (Basic, Premium)
    }
}
