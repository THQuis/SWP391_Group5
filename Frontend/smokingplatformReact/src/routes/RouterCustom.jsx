import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "../utils/router";

import UserLayout from "../layouts/UserLayout";

import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagementUser from "../pages/admin/ManagementUser";
import ManagementPackage from "../pages/admin/ManagementPackage";
import ManagementBlog from "../pages/admin/ManagementBlog";
import ManagementPerformance from "../pages/admin/ManagementPerformance";
import ManagementNotification from "../pages/admin/ManagementNotification";
import ManagementPlan from "../pages/admin/ManagementPlan";

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

            {/* Admin  */}
            <Route path={ROUTERS.ADMIN.DASHBOARD} element={
                <AdminLayout>
                    <AdminDashboard />
                </AdminLayout>
            } />
            {/* Admin user */}
            <Route path={ROUTERS.ADMIN.MANAUSER} element={
                <AdminLayout>
                    <ManagementUser />
                </AdminLayout>
            } />
            {/* Adim package*/}
            <Route path={ROUTERS.ADMIN.MANAPACKAGE} element={
                <AdminLayout>
                    <ManagementPackage />
                </AdminLayout>
            } />
            {/* admin blog */}
            <Route path={ROUTERS.ADMIN.MANABLOG} element={
                <AdminLayout>
                    <ManagementBlog />
                </AdminLayout>
            } />

            {/* admin performance  */}
            <Route path={ROUTERS.ADMIN.MANAPERFORMANCE} element={
                <AdminLayout>
                    <ManagementPerformance />
                </AdminLayout>
            } />
            {/* admin notification  */}
            <Route path={ROUTERS.ADMIN.MANANOTIFICATION} element={
                <AdminLayout>
                    <ManagementNotification />
                </AdminLayout>
            } />

            {/* admin planplan*/}
            <Route path={ROUTERS.ADMIN.MANAPLAN} element={
                <AdminLayout>
                    <ManagementPlan />
                </AdminLayout>
            } />
        </Routes>

    );
};

export default RouterCustom;
