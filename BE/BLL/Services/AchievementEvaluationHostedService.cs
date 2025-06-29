using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Threading;
using System.Threading.Tasks;

public class AchievementEvaluationHostedService : BackgroundService
{
    private readonly ILogger<AchievementEvaluationHostedService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public AchievementEvaluationHostedService(ILogger<AchievementEvaluationHostedService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.Now;
            var nextRunTime = now.Date.AddDays(1).AddHours(0).AddMinutes(30);
            var delay = nextRunTime - now;

            _logger.LogInformation("Đợi đến lần chạy tiếp theo vào: {Time}", nextRunTime);
            await Task.Delay(delay, stoppingToken);

            using var scope = _serviceProvider.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var evaluator = scope.ServiceProvider.GetRequiredService<IAchievementEvaluatorService>();

            var users = await unitOfWork.Users.GetAllAsync();
            foreach (var user in users)
            {
                try
                {
                    await evaluator.EvaluateAndGrantAchievementsAsync(user.UserID);
                    _logger.LogInformation($"✅ Đánh giá thành tựu cho UserID={user.UserID}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"❌ Lỗi khi đánh giá thành tựu cho UserID={user.UserID}");
                }
            }
        }
    }
}
