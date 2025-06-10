namespace Smoking.DAL.Entities
{
    public class UserMembership
    {
        // Khóa chính
        public int UserMembershipId { get; set; }  // Đảm bảo đúng tên

        // Các khóa ngoại
        public int UserId { get; set; }  // Liên kết với bảng User
        public int PackageId { get; set; }  // Liên kết với bảng MembershipPackage

        // Các thuộc tính khác
        public string PaymentStatus { get; set; }  // Trạng thái thanh toán
        public DateTime StartDate { get; set; }  // Ngày bắt đầu
        public DateTime EndDate { get; set; }  // Ngày kết thúc

        // Navigation properties
        public User User { get; set; }  // Liên kết đến bảng User
        public MembershipPackage MembershipPackage { get; set; }  // Liên kết đến bảng MembershipPackage
    }
}
