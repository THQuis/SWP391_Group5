import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "../utils/router";

import UserLayout from "../layouts/UserLayout";

import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserProfile from "../pages/user/UserProfile";
import ManagementUser from "../pages/admin/ManagementUser";
// import ManagementUser from "../pages/admin/test";




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


        </Routes>

    );
};

export default RouterCustom;
