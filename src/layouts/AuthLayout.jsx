import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="auth-page-wrapper">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
