//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Smoking.DAL.Entities;
//using Smoking.DAL.Interfaces.Repositories;
//using System.Threading.Tasks;

//namespace Smoking.API.Controllers.Admin
//{
//    [ApiController]
//    [Route("api/admin/package-milestones")]
//    [Authorize(Roles = "1")] // Chỉ admin mới được truy cập
//    public class PackageMilestoneController : ControllerBase
//    {
//        private readonly IUnitOfWork _unitOfWork;

//        public PackageMilestoneController(IUnitOfWork unitOfWork)
//        {
//            _unitOfWork = unitOfWork;
//        }

//        // Lấy tất cả các package milestone
//        [HttpGet("list")]
//        public async Task<IActionResult> GetAll()
//        {
//            var list = await _unitOfWork.PackageMilestones.GetAllAsync();
//            return Ok(list);
//        }

//        // Lấy theo ID
//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetById(int id)
//        {
//            var item = await _unitOfWork.PackageMilestones.GetByIdAsync(id);
//            if (item == null)
//                return NotFound(new { message = "Không tìm thấy dữ liệu." });

//            return Ok(item);
//        }

//        // Tạo mới
//        [HttpPost("create")]
//        public async Task<IActionResult> Create([FromBody] PackageMilestone model)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            await _unitOfWork.PackageMilestones.AddAsync(model);
//            await _unitOfWork.CompleteAsync();

//            return Ok(new { message = "Tạo thành công", data = model });
//        }

//        // Cập nhật
//        [HttpPut("update/{id}")]
//        public async Task<IActionResult> Update(int id, [FromBody] PackageMilestone model)
//        {
//            var existing = await _unitOfWork.PackageMilestones.GetByIdAsync(id);
//            if (existing == null)
//                return NotFound(new { message = "Không tìm thấy dữ liệu." });

//            existing.PackageID = model.PackageID;
//            existing.MilestoneID = model.MilestoneID;
//            existing.DetailDescription = model.DetailDescription;

//            _unitOfWork.PackageMilestones.Update(existing);
//            await _unitOfWork.CompleteAsync();

//            return Ok(new { message = "Cập nhật thành công", data = existing });
//        }

//        // Xóa
//        [HttpDelete("delete/{id}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var item = await _unitOfWork.PackageMilestones.GetByIdAsync(id);
//            if (item == null)
//                return NotFound(new { message = "Không tìm thấy dữ liệu." });

//            _unitOfWork.PackageMilestones.Delete(item);
//            await _unitOfWork.CompleteAsync();

//            return Ok(new { message = "Xóa thành công" });
//        }
//    }
//}
