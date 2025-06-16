namespace Smoking.API.Models.System
{
    public class AutoQuitPlanRequest
    {
        public int UserId { get; set; }
        public int CigarettesPerDay { get; set; }
        public decimal PricePerPack { get; set; }
        public int CigarettesPerPack { get; set; }
    }

}
