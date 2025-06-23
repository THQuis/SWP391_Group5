namespace Smoking.API.Models.Admin
{
    public class AchievementCreate
    {
        public string AchievementName { get; set; }
        public string Description { get; set; }
        public string Criteria { get; set; }
        public string? BadgeImage { get; set; }
        public string PackageType { get; set; }
    }

}
