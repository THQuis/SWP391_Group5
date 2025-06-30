using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Admin
{
    [ApiController]
    [Route("api/Admin/Achievement")]
    [Authorize(Roles = "1")]
    public class AchievementAdminController : ControllerBase
    {
        private readonly IAchievementService _service;

        public AchievementAdminController(IAchievementService service)
        {
            _service = service;
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllAsync();
            return Ok(data);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Create([FromBody] Achievement dto)
        {
            if (string.IsNullOrWhiteSpace(dto.AchievementName) ||
                string.IsNullOrWhiteSpace(dto.PackageType))
            {
                return BadRequest(new { ok = false, msg = "Tên và loại gói là bắt buộc." });
            }

            var achievement = new Achievement
            {
                AchievementName = dto.AchievementName,
                Description = dto.Description,
                Criteria = dto.Criteria,
                BadgeImage = dto.BadgeImage,
                PackageType = dto.PackageType,
                SmokeFreeDaysRequired = dto.SmokeFreeDaysRequired,
                MoneySavedRequired = dto.MoneySavedRequired,
                CigarettesDroppedRequired = dto.CigarettesDroppedRequired
            };

            await _service.CreateAsync(achievement);

            return Ok(new
            {
                ok = true,
                msg = "Thêm thành tựu thành công.",
                data = achievement
            });
        }

        [HttpPut("Update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Achievement dto)
        {
            var existing = await _service.GetByIdAsync(id);
            if (existing == null)
                return NotFound(new { ok = false, msg = "Không tìm thấy thành tựu." });

            existing.AchievementName = dto.AchievementName ?? existing.AchievementName;
            existing.Description = dto.Description ?? existing.Description;
            existing.Criteria = dto.Criteria ?? existing.Criteria;
            existing.BadgeImage = dto.BadgeImage ?? existing.BadgeImage;
            existing.PackageType = dto.PackageType ?? existing.PackageType;
            existing.SmokeFreeDaysRequired = dto.SmokeFreeDaysRequired;
            existing.MoneySavedRequired = dto.MoneySavedRequired;
            existing.CigarettesDroppedRequired = dto.CigarettesDroppedRequired;

            await _service.UpdateAsync(existing);
            return Ok(new { ok = true, msg = "Cập nhật thành công." });
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);

            if (!success)
                return NotFound(new { ok = false, msg = "Không tìm thấy thành tựu." });

            return Ok(new { ok = true, msg = "Xoá thành công." });
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search([FromQuery] string keyword)
        {
            var data = await _service.SearchAsync(keyword);

            if (!data.Any())
            {
                return Ok(new
                {
                    ok = false,
                    msg = "Không tìm thấy kết quả nào.",
                    data = Array.Empty<Achievement>()
                });
            }

            return Ok(new
            {
                ok = true,
                msg = "Tìm kiếm thành công.",
                data
            });
        }
    }
}