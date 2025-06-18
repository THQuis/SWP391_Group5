namespace Smoking.API.Models.User
{
    public class QuitPlanUpdateCoreRequest
    {
        public int? CigarettesPerDayAtStart { get; set; }
        public decimal? PricePerPackAtStart { get; set; }
        public int? CigarettesPerPack { get; set; }
    }

}