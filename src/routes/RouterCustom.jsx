import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "../utils/router";

import UserLayout from "../layouts/UserLayout";

import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";



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


            <Route path={ROUTERS.ADMIN.DASHBOARD} element={
                <AdminLayout>
                    <AdminDashboard />
                </AdminLayout>
            } />


        </Routes>

    );
};

export default RouterCustom;
