namespace Smoking.API.Models.User
{
    public class CreatePaymentRequest
    {
        public int? UserId { get; set; }     // ← thêm dòng này
        public int PackageId { get; set; }
        public string Method { get; set; }
    }

}
