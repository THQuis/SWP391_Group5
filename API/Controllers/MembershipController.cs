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

        //  Lấy tất cả các gói thành viên
        [HttpGet("packages")]
        public async Task<IActionResult> GetAllPackages()
        {
            var packages = await _unitOfWork.MembershipPackages.GetAllAsync();
            return Ok(packages);
        }


        // 2️ Lấy gói thành viên theo tên (Basic, Premium)
        [HttpGet("package/{name}")]
        public async Task<IActionResult> GetPackageByName(string name)
        {
            var package = await _unitOfWork.MembershipPackages.GetPackageByNameAsync(name);
            if (package == null)
                return NotFound(new { Message = "Gói không tồn tại." });

            return Ok(package);
        }


        // 3️⃣ Đăng ký gói thành viên
        [HttpPost("subscribe")]
        public async Task<IActionResult> SubscribePackage([FromBody] SubscribePackageRequest request)
        {
            var package = await _unitOfWork.MembershipPackages.GetPackageByNameAsync(request.PackageName);
            if (package == null)
                return NotFound(new { Message = "Gói không tồn tại." });

            // TODO: Đăng ký gói cho người dùng (Liên kết người dùng với gói)

            return Ok(new { Message = $"Đăng ký thành công gói {package.PackageName}!" });
        }



    }

    // Request model để đăng ký gói
    public class SubscribePackageRequest
    {
        public string PackageName { get; set; }  // Tên gói (Basic, Premium)
    }
}
