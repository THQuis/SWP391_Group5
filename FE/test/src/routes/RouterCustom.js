// RouterCustom.js đã được sửa lại và tối ưu

import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "../utils/router";
import ProtectedRoute from './ProtectedRoute';

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

// Public Pages
import AuthPage from "../pages/auth/AuthPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

// User Pages
import HomePage from "../pages/home/HomePage";
import UserProfile from "../pages/user/UserProfile";
import QuitPlanPage from "../pages/user/QuitPlanPage";
import MilestonesPage from "../pages/user/MilestonesPage";
import MockAutomatedProgress from "../pages/user/MockAutomatedProgress";
import BlogPage from "../pages/user/BlogPage";
import PackagePage from "../pages/user/PackagePage";
import CoachList from "../pages/user/CoachList";
import RankingPage from "../pages/user/RankingPage";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagementUser from "../pages/admin/ManagementUser";
import ManagementBlog from "../pages/admin/ManagementBlog";
import ManagementPackage from "../pages/admin/ManagementPackage";
import ManagementPerformance from "../pages/admin/ManagementPerformance";
import ManagementPlan from "../pages/admin/ManagementPlan";
import ManagementNotification from "../pages/admin/ManagementNotification";
import ProfileOfCoach from "../pages/user/ProfileOfCoach";


const RouterCustom = () => {
    return (
        <Routes>
            {/* === CÁC ROUTE CÔNG KHAI === */}
            <Route path={ROUTERS.AUTH.LOGIN} element={<AuthPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* === LAYOUT CHO USER VÀ CÁC TRANG CON === */}
            {/* Tất cả các trang của user sẽ có chung Header và Footer của UserLayout */}
            <Route path="/" element={<UserLayout />}>
                <Route index element={<HomePage />} />
                <Route path={ROUTERS.USER.PROFILE} element={<UserProfile />} />
                <Route path={ROUTERS.USER.QUITPLAN} element={<QuitPlanPage />} />
                <Route path={ROUTERS.USER.MILESTONES} element={<MilestonesPage />} />
                <Route path={ROUTERS.USER.PROGRESS} element={<MockAutomatedProgress />} />
                <Route path={ROUTERS.USER.BLOG} element={<BlogPage />} />
                <Route path={ROUTERS.USER.PACKAGE} element={<PackagePage />} />
                <Route path={ROUTERS.USER.COACH} element={<CoachList />} />
                <Route path={ROUTERS.USER.RANKING} element={<RankingPage />} />
                <Route path={ROUTERS.USER.PROFILECOACH} element={<ProfileOfCoach />} />
                {/* CoachDashboard */}

            </Route>

            {/* === LAYOUT CHO ADMIN VÀ CÁC TRANG CON (Được bảo vệ) === */}
            {/* Tất cả các trang của admin sẽ có chung Header và Sidebar của AdminLayout */}
            <Route element={<ProtectedRoute allowedRoles={[1]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    {/* Bỏ các thẻ <AdminLayout> thừa ở đây */}
                    <Route path={ROUTERS.ADMIN.USER} element={<ManagementUser />} />
                    <Route path={ROUTERS.ADMIN.BLOG} element={<ManagementBlog />} />
                    <Route path={ROUTERS.ADMIN.PACKAGE} element={<ManagementPackage />} />
                    <Route path={ROUTERS.ADMIN.ACHIVE} element={<ManagementPerformance />} />
                    <Route path={ROUTERS.ADMIN.PLAN} element={<ManagementPlan />} />
                    <Route path={ROUTERS.ADMIN.NOTIFICATION} element={<ManagementNotification />} />
                </Route>
            </Route>

            {/* Thêm Route cho trang 404 Not Found */}
            <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Routes>
    );
};

export default RouterCustom;