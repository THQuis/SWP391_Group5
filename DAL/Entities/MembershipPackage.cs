using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    public class MembershipPackage
    {
        [Key]
        public int PackageID { get; set; }

        [Required, MaxLength(255)]
        public string PackageName { get; set; }  // Tên gói (Basic, Premium)

        [Required, MaxLength(50)]
        public string PackageType { get; set; }  // Loại gói (Basic, Premium)

        public string Description { get; set; }  // Mô tả gói thành viên

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }  // Giá gói

        [Required]
        public int Duration { get; set; }  // Thời gian gói (1 tháng, 3 tháng, 12 tháng)

        // Navigation Property
        public ICollection<UserMembership> UserMemberships { get; set; }
    }
}
