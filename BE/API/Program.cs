using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Smoking.API.Models;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Models;
using Smoking.BLL.Services;
using Smoking.DAL.Data;
using Smoking.DAL.Interfaces.Repositories;
using Smoking.DAL.Repositories;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            // Thay thế "http://localhost:3000" bằng địa chỉ của frontend React của bạn
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});


// --- CẤU HÌNH CÁC SETTINGS ---
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

// --- CẤU HÌNH DATABASE ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- ĐĂNG KÝ CÁC SERVICE VÀ REPOSITORIES ---

// Authentication & Authorization
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserAchievementService, UserAchievementService>();
builder.Services.AddScoped<IAchievementService, AchievementService>();
builder.Services.AddScoped<IAchievementEvaluatorService, AchievementEvaluatorService>();

// User Membership & Payment
builder.Services.AddScoped<IMembershipPackageService, MembershipPackageService>();
builder.Services.AddScoped<IUserMembershipService, UserMembershipService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IMembershipPackageRepository, MembershipPackageRepository>();
builder.Services.AddScoped<IUserMembershipRepository, UserMembershipRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();

// Blog & Notification
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// Progress & Plan
builder.Services.AddScoped<IQuitPlanService, QuitPlanService>();
builder.Services.AddScoped<IQuitPlanAutoService, QuitPlanAutoService>();
builder.Services.AddScoped<IQuitProgressService, QuitProgressService>();
builder.Services.AddScoped<IQuitProgressRepository, QuitProgressRepository>();

// Questionnaire & Email
builder.Services.AddScoped<IQuestionnaireService, QuestionnaireService>();
builder.Services.AddScoped<IMailService, MailService>();
builder.Services.Configure<MomoConfig>(builder.Configuration.GetSection("Momo"));


// --- CẤU HÌNH CÁC DỊCH VỤ KHÁC ---
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>(); // Đảm bảo bạn đăng ký UnitOfWork nếu chưa có
builder.Services.AddMemoryCache(); // MemoryCache cho OTP tạm

// --- CẤU HÌNH CONTROLLER ---
builder.Services.AddControllers();

// --- CẤU HÌNH JWT BEARER AUTHENTICATION ---
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

// --- CẤU HÌNH AUTHORIZE ---
builder.Services.AddAuthorization();

// --- CẤU HÌNH SWAGGER ---
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

// --- CẤU HÌNH SWAGGER TRONG MÔI TRƯỜNG DEVELOPMENT ---
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
// =================================================================
// ⭐ BƯỚC 2: KÍCH HOẠT MIDDLEWARE CORS (ĐẶT TRƯỚC UseAuthentication)
// ===============================================e==================
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

// --- ĐĂNG KÝ CÁC ROUTE ---
app.MapControllers();

app.Run();
