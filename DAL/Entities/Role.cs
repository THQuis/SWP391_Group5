using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; }

        [Required, MaxLength(50)]
        public string RoleName { get; set; }

        public string Description { get; set; }

        // Navigation
        public ICollection<User> Users { get; set; }
    }
}
