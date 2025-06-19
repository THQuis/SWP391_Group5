using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/membership")]
    public class MembershipController : ControllerBase
    {
        private readonly IMembershipPackageService _packageService;
        private readonly IPaymentService _paymentService;
        private readonly IUserMembershipService _userMembershipService;

        public MembershipController(
            IMembershipPackageService packageService,
            IPaymentService paymentService,
            IUserMembershipService userMembershipService)
        {
            _packageService = packageService;
            _paymentService = paymentService;
            _userMembershipService = userMembershipService;
        }

        // Lấy danh sách gói + gói hiện tại nếu có token
        [HttpGet("packages")]
        public async Task<IActionResult> GetPackages()
        {
            var userId = GetUserId();
            var packages = await _packageService.GetAllAsync();
            if (userId == 0)
            {
                return Ok(new { packages });
            }

            var activeMembership = await _userMembershipService.GetActiveByUserIdAsync(userId);
            return Ok(new
            {
                packages,
                currentPackageId = activeMembership?.PackageID,
                currentPackageEnd = activeMembership?.EndDate
            });
        }

        // Tạo thanh toán (ưu tiên lấy userId từ DTO, fallback về token)
        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest dto)
        {
            var userId = dto.UserId ?? GetUserId();
            if (userId == 0)
                return BadRequest("Không xác định được người dùng.");

            try
            {
                var (payUrl, reference) = await _paymentService.CreatePaymentAsync(userId, dto.PackageId, dto.Method);
                return Ok(new { payUrl, reference });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Nhận callback từ Momo/VNPay
        [HttpPost("payment-callback")]
        public async Task<IActionResult> PaymentCallback([FromBody] PaymentCallbackDto dto)
        {
            await _paymentService.HandlePaymentCallbackAsync(dto.TransactionReference, dto.Status);
            return Ok();
        }

        // Đọc UserId từ token nếu có
        private int GetUserId()
        {
            var idStr = User.FindFirst("id")?.Value;
            return int.TryParse(idStr, out var id) ? id : 0;
        }
    }
}
