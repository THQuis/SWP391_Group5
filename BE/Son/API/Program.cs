using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Smoking.API.Models;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Models; // Đảm bảo namespace này tồn tại và chứa EmailSettings nếu bạn dùng
using Smoking.BLL.Services;
using Smoking.DAL.Data;
using Smoking.DAL.Interfaces.Repositories;
using Smoking.DAL.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình JwtSettings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

// Cấu hình EmailSettings
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));

// Đăng ký DbContext với SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký các service, repository
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Đăng ký MailService
builder.Services.AddScoped<IMailService, MailService>();

// ... các service khác
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
builder.Services.AddScoped<IBlogService, BlogService>();

// --- ĐĂNG KÝ USER SERVICE ---
builder.Services.AddScoped<IUserService, UserService>();

// Thêm các dòng sau trong ConfigureServices

builder.Services.AddScoped<INotificationService, NotificationService>();  // Đăng ký NotificationService
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();  // Đăng ký NotificationRepository
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>(); // Đảm bảo bạn đăng ký UnitOfWork nếu chưa có
builder.Services.AddScoped<IAchievementService, AchievementService>();
builder.Services.AddScoped<IAchievementRepository, AchievementRepository>();
builder.Services.AddScoped<IUserAchievementService, UserAchievementService>();

// --- HẾT ĐĂNG KÝ USER SERVICE ---

// Thêm MemoryCache (bắt buộc nếu dùng để lưu OTP tạm)
builder.Services.AddMemoryCache();

// Thêm Controller
builder.Services.AddControllers();

// Cấu hình Authentication dùng JWT Bearer
var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

// Thêm Authorization
builder.Services.AddAuthorization();

// Cấu hình Swagger để hỗ trợ JWT Bearer token
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Smoking API", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter JWT Bearer token **_only_**",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, new string[] { } }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Smoking API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();