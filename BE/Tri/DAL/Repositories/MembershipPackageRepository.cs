﻿using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;

namespace Smoking.DAL.Repositories
{
    public class MembershipPackageRepository : GenericRepository<MembershipPackage>, IMembershipPackageRepository
    {
        public MembershipPackageRepository(AppDbContext context) : base(context)
        {
        }

        // Hiện tại chưa có truy vấn đặc thù, dùng hết các phương thức từ GenericRepository
    }
}
