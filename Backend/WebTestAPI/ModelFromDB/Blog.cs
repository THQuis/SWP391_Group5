using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("Blog")]
public partial class Blog
{
    [Key]
    public int BlogId { get; set; }

    [StringLength(255)]
    public string Title { get; set; } = null!;

    public string Content { get; set; } = null!;

    public int AuthorId { get; set; }

    [StringLength(100)]
    public string? CategoryName { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastModifiedDate { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }

    public int? Likes { get; set; }

    public int? Dislikes { get; set; }

    [ForeignKey("AuthorId")]
    [InverseProperty("Blogs")]
    public virtual User Author { get; set; } = null!;
}
