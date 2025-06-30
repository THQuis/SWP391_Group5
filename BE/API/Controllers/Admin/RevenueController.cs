using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;

namespace Smoking.API.Controllers.Admin
{
    [Authorize(Roles = "1")] // admin
    [ApiController]
    [Route("api/[controller]")]
    public class RevenueController : ControllerBase
    {
        private readonly IRevenueService _revenueService;

        public RevenueController(IRevenueService revenueService)
        {
            _revenueService = revenueService;
        }

        [HttpGet("month")]
        public async Task<IActionResult> GetMonthlyRevenue([FromQuery] int year, [FromQuery] int month)
        {
            var total = await _revenueService.GetMonthlyRevenueAsync(year, month);
            return Ok(new { month, year, total });
        }

        [HttpGet("year")]
        public async Task<IActionResult> GetYearRevenue([FromQuery] int year)
        {
            var result = await _revenueService.GetRevenueByMonthRangeAsync(year);
            return Ok(result);
        }
    }

}
