namespace Smoking.API.Models.User
{
    public class UpdateQuitProgressRequest
    {
        public int QuitPlanId { get; set; }            // ID của kế hoạch cai thuốc
        public DateTime ProgressDate { get; set; }     // Ngày tiến trình
        public int CigarettesSmoked { get; set; }      // Số điếu thuốc đã hút (cộng dồn)
        public decimal PricePerPack { get; set; }      // Giá mỗi gói thuốc
        public int CigarettesPerPack { get; set; }     // Số điếu thuốc trong mỗi gói
        public int? CigarettesSmokedToday { get; set; }  // Số điếu thuốc hút trong ngày hiện tại
    }

}
