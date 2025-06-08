// RouterCustom.jsx
import { Routes, Route } from "react-router-dom";
import { ROUTERS } from "../utils/router";

// import AuthLayout from "../layouts/AuthLayout";
import UserLayout from "../layouts/UserLayout";

import AuthPage from "../pages/auth/AuthPage";
import HomePage from "../pages/home/HomePage";

const RouterCustom = () => {
    return (
        <Routes>
            {/* Auth layout */}
            <Route path={ROUTERS.AUTH.LOGIN} element={
                <AuthPage />
            } />

            {/* User layout */}
            <Route path={ROUTERS.USER.HOME} element={
                <UserLayout>
                    <HomePage />
                </UserLayout>
            } />

            {/* <Route path={ROUTERS.USER.HOME2} element={
                <UserLayout>
                    <HomePage />
                </UserLayout>
            } /> */}
        </Routes>
    );
};

export default RouterCustom;
