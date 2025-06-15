import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "../utils/router";

import UserLayout from "../layouts/UserLayout";

import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserProfile from "../pages/user/UserProfile";
import ManagementUser from "../pages/admin/ManagementUser";
import ManagementBlog from "../pages/admin/ManagementBlog";
import ManagementPackage from "../pages/admin/ManagementPackage";
import ManagementPerformance from "../pages/admin/ManagementPerformance";
import ManagementPlan from "../pages/admin/ManagementPlan";
import ManagementNotification from "../pages/admin/ManagementNotification";
import UserBlog from "../pages/user/UserBlog";// user
import UserRanking from "../pages/user/UserRanking"; // user ranking




// import ManagementBlog from "../pages/admin/test";



const RouterCustom = () => {
    return (
        <Routes>
            <Route path={ROUTERS.AUTH.LOGIN} element={
                <AuthPage />
            } />

            {/* User layout */}
            <Route path={ROUTERS.USER.HOME} element={
                <UserLayout>
                    <HomePage />
                </UserLayout>
            } />
            <Route path={ROUTERS.USER.PROFILE} element={
                <UserLayout>
                    <UserProfile />
                </UserLayout>
            } />
            <Route path={ROUTERS.USER.BLOG} element={
                <UserLayout>
                    < UserBlog />
                </UserLayout>
            } />
            <Route path={ROUTERS.USER.RANKING} element={
                <UserLayout>
                    < UserRanking />
                </UserLayout>
            } />


            {/* Admin layout */}
            <Route path={ROUTERS.ADMIN.DASHBOARD} element={
                <AdminLayout>
                    <AdminDashboard />
                </AdminLayout>
            } />



            <Route path={ROUTERS.ADMIN.USER} element={
                <AdminLayout>
                    <ManagementUser />
                </AdminLayout>
            } />
            <Route path={ROUTERS.ADMIN.BLOG} element={
                <AdminLayout>
                    <ManagementBlog />
                </AdminLayout>
            } />

            <Route path={ROUTERS.ADMIN.PACKAGE} element={
                <AdminLayout>
                    <ManagementPackage />
                </AdminLayout>
            } />
            <Route path={ROUTERS.ADMIN.ACHIVE} element={
                <AdminLayout>
                    <ManagementPerformance />
                </AdminLayout>
            } />
            <Route path={ROUTERS.ADMIN.PLAN} element={
                <AdminLayout>
                    <ManagementPlan />
                </AdminLayout>
            } />

            <Route path={ROUTERS.ADMIN.NOTIFICATION} element={
                <AdminLayout>
                    <ManagementNotification />
                </AdminLayout>
            } />


        </Routes>

    );
};

export default RouterCustom;
