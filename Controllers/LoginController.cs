using System.Collections.Concurrent;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebTestAPI.DTOs;
using WebTestAPI.ModelFromDB;
using WebTestAPI.Services;

namespace WebTestAPI.Controllers
{
    [Route("api")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly CSDL_SmookingPlatFrom _context;
        private readonly TokenService _tokenService;
        private readonly EmailService _emailService;

        // Lưu OTP tạm trong RAM
        private static readonly ConcurrentDictionary<string, string> _tempOtpStorage = new();

        public LoginController(
            CSDL_SmookingPlatFrom context,
            TokenService tokenService,
            EmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
        }

        // =======================
        // 🔐 API: Đăng nhập
        // =======================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.Password != request.Password)
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });

            if (user.Status != "Active")
                return Forbid("Tài khoản chưa được xác minh hoặc đã bị khóa.");

            var token = _tokenService.CreateToken(user);

            return Ok(new
            {
                token,
                message = "Đăng nhập thành công!",
                role = user.Role?.RoleName ?? "Member",
                fullName = user.FullName
            });
        }

        // =======================
        // 📨 API: Đăng ký + Gửi OTP
        // =======================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Kiểm tra nếu người dùng đã tồn tại
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Email đã tồn tại trong hệ thống!" });
            }

            // Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Mật khẩu và xác nhận mật khẩu không khớp!" });
            }

            // Tạo mã OTP ngẫu nhiên
            var otp = new Random().Next(100000, 999999).ToString();

            // Gửi OTP qua email
            await _emailService.SendEmailAsync(
                request.Email,
                "Mã xác nhận đăng ký QuitSmart",
                $"Mã OTP của bạn là: {otp}"
            );

            // Tạo người dùng với trạng thái "Pending"
            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,  // Lưu mật khẩu (nên mã hóa trước khi lưu vào DB)
                PhoneNumber = request.PhoneNumber,
                Status = "Pending",  // Trạng thái chưa xác thực
                RoleId = 1,         // Vai trò mặc định là "Member"
                RegistrationDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Lưu OTP tạm thời vào bộ nhớ
            _tempOtpStorage[request.Email] = otp;

            return Ok(new { message = "Mã xác nhận đã được gửi đến email. Vui lòng kiểm tra để xác thực." });
        }


        // =======================
        // ✅ API: Xác thực OTP
        // =======================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request)
        {
            if (!_tempOtpStorage.TryGetValue(request.Email, out var storedOtp))
                return BadRequest(new { message = "Không tìm thấy mã xác minh cho email này." });

            if (storedOtp != request.Otp)
                return BadRequest(new { message = "Mã OTP không chính xác." });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng." });

            user.Status = "Active";
            await _context.SaveChangesAsync();

            _tempOtpStorage.TryRemove(request.Email, out _);

            return Ok(new { message = "Xác thực OTP thành công! Bạn có thể đăng nhập." });
        }

        // =======================
        // 🔑 API: Quên mật khẩu - Gửi OTP
        // =======================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound(new { message = "Email không tồn tại trong hệ thống." });
            }

            // Tạo mã OTP ngẫu nhiên
            var otp = new Random().Next(100000, 999999).ToString();

            // Gửi OTP qua email
            await _emailService.SendEmailAsync(
                request.Email,
                "Mã xác nhận quên mật khẩu",
                $"Mã OTP của bạn là: {otp}"
            );

            // Lưu OTP tạm thời
            _tempOtpStorage[request.Email] = otp;

            return Ok(new { message = "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư." });
        }


   

        // =======================
        // 🔑 API: Đặt lại mật khẩu
        // =======================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            // Kiểm tra OTP
            if (!_tempOtpStorage.TryGetValue(request.Email, out var storedOtp) || storedOtp != request.Otp)
            {
                return BadRequest(new { message = "Mã OTP không chính xác." });
            }

            // Lấy người dùng từ cơ sở dữ liệu
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng." });
            }

            // Cập nhật mật khẩu mới
            user.Password = request.NewPassword; // Mã hóa mật khẩu trước khi lưu vào DB nếu cần
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Xóa OTP đã sử dụng
            _tempOtpStorage.TryRemove(request.Email, out _);

            return Ok(new { message = "Mật khẩu đã được thay đổi thành công!" });
        }

        // =======================
        // Xóa người dùng
        // =======================
        [HttpDelete("delete/{email}")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Status == "Active");

            if (user == null)
                return NotFound(new { message = "Không tìm thấy người dùng đã xác minh với email này." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Tài khoản với email {email} đã được xóa." });
        }
    }
}
