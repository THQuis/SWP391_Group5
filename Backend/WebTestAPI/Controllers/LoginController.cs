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
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Email đã tồn tại trong hệ thống!" });
            }

            // Tạo mã OTP ngẫu nhiên
            var otp = new Random().Next(100000, 999999).ToString();

            // Gửi email xác nhận
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
                Password = request.Password,
                Status = "Pending",
                RoleId = 1,
                RegistrationDate = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

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

        //Delete
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