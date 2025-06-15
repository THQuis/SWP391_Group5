using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.Admin;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Admin
{
    [ApiController]
    [Route("api/Admin")]
    [Authorize(Roles = "1")]
    public class AchievementAdminController : ControllerBase
    {
        private readonly IAchievementService _service;

        public AchievementAdminController(IAchievementService service)
        {
            _service = service;
        }

        //
        [HttpGet("ListAchievement")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("GetAchivementById")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost("AddAchivement")]
        public async Task<IActionResult> Create([FromBody] AchievementCreate dto)
        {
            if (string.IsNullOrWhiteSpace(dto.AchievementName) ||
                string.IsNullOrWhiteSpace(dto.Description) ||
                string.IsNullOrWhiteSpace(dto.Criteria) ||
                string.IsNullOrWhiteSpace(dto.PackageType))
            {
                return BadRequest(new { ok = false, msg = "Thông tin thành tựu không hợp lệ." });
            }

            var achievement = new Achievement
            {
                AchievementName = dto.AchievementName,
                Description = dto.Description,
                Criteria = dto.Criteria,
                BadgeImage = dto.BadgeImage,
                PackageType = dto.PackageType
            };

            await _service.CreateAsync(achievement);

            return Ok(new
            {
                ok = true,
                msg = "Thêm thành tựu thành công.",
                data = achievement
            });
        }


        [HttpPut("UpdateAchievement/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AchievementUpdate dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
                return NotFound(new { ok = false, msg = "Không tìm thấy thành tựu" });

            if (!string.IsNullOrWhiteSpace(dto.AchievementName))
                existing.AchievementName = dto.AchievementName;
            if (!string.IsNullOrWhiteSpace(dto.Description))
                existing.Description = dto.Description;
            if (!string.IsNullOrWhiteSpace(dto.Criteria))
                existing.Criteria = dto.Criteria;
            if (!string.IsNullOrWhiteSpace(dto.BadgeImage))
                existing.BadgeImage = dto.BadgeImage;
            if (!string.IsNullOrWhiteSpace(dto.PackageType))
                existing.PackageType = dto.PackageType;

            await _service.UpdateAsync(existing);
            return Ok(new { ok = true, msg = "Cập nhật thành công" });
        }



        [HttpDelete("DeleteAchivement")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);

            if (!success)
                return NotFound(new { ok = false, msg = "Xoá thất bại, không tìm thấy thành tựu." });

            return Ok(new { ok = true, msg = "Xoá thành công." });
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(string keyword)
        {
            var data = await _service.SearchAsync(keyword);

            if (data == null || !data.Any())
            {
                return Ok(new
                {
                    ok = false,
                    msg = "Không tìm thấy kết quả nào",
                    data = Array.Empty<Achievement>()
                });
            }

            return Ok(new
            {
                ok = true,
                msg = "Tìm kiếm thành công",
                data
            });
        }

    }
}