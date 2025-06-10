    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using Smoking.API.Models;
    using Smoking.API.Models.Account;
    using Smoking.BLL.Interfaces;
    using Smoking.DAL.Entities;
    using System;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;
    using System.Threading.Tasks;

    namespace Smoking.API.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class AuthController : ControllerBase
        {
            private readonly IAuthService _authService;
            private readonly JwtSettings _jwtSettings;

            public AuthController(IAuthService authService, IOptions<JwtSettings> jwtOptions)
            {
                _authService = authService;
                _jwtSettings = jwtOptions.Value;
            }

            // Bước 1: Đăng ký - gửi OTP qua Email
            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] RegisterRequest request)
            {
                try
                {
                    await _authService.RegisterTempAsync(request.FullName, request.Email, request.Password, request.PhoneNumber);
                    return Ok(new { Message = "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác thực." });
                }
                catch (Exception ex)
                {
                    return BadRequest(new { Error = ex.Message });
                }
            }

            // Bước 2: Xác nhận OTP - lưu user vào database
            [HttpPost("verify-otp")]
            public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
            {
                var success = await _authService.VerifyOtpAndRegisterAsync(request.Email, request.OtpCode);
                if (!success)
                    return BadRequest(new { Error = "OTP không hợp lệ hoặc đã hết hạn." });

                return Ok(new { Message = "Xác thực OTP thành công. Tài khoản đã được kích hoạt." });
            }

            // Đăng nhập
            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginRequest request)
            {
                var user = await _authService.AuthenticateAsync(request.Email, request.Password);
                if (user == null)
                    return Unauthorized(new { Error = "Email hoặc mật khẩu không đúng." });

                var token = GenerateJwtToken(user);
                return Ok(new
                {
                    Token = token,
                    User = new
                    {
                        user.UserID,
                        user.FullName,
                        user.Email,
                        user.PhoneNumber,
                        user.RoleID
                    }
                });
            }

            // Tạo JWT Token
            private string GenerateJwtToken(User user)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_jwtSettings.SecretKey);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                        new Claim(ClaimTypes.Name, user.FullName),
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.Role, user.RoleID.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresInMinutes),
                    Issuer = _jwtSettings.Issuer,
                    Audience = _jwtSettings.Audience,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }

        // Bước 1: Gửi OTP quên mật khẩu
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                await _authService.SendForgotPasswordOtpAsync(request.Email);
                return Ok(new { Message = "Đã gửi mã OTP tới email. Vui lòng kiểm tra email để tiếp tục." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        // Bước 2: Xác nhận OTP quên mật khẩu
        [HttpPost("verify-reset-otp")]
        public async Task<IActionResult> VerifyResetOtp([FromBody] VerifyOtpRequest request)
        {
            var isValid = await _authService.VerifyForgotPasswordOtpAsync(request.Email, request.OtpCode);
            if (!isValid)
                return BadRequest(new { Error = "OTP không hợp lệ hoặc đã hết hạn." });

            return Ok(new { Message = "Xác thực OTP thành công. Bạn có thể đặt lại mật khẩu mới." });
        }

        // Bước 3: Đặt lại mật khẩu mới
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                await _authService.ResetPasswordAsync(request.Email, request.NewPassword);
                return Ok(new { Message = "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
   

   



    }
}
