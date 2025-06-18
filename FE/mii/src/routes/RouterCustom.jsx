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
import UserPackage from "../pages/user/UserPackage"; // user package
import QuitPlanPage from "../pages/user/QuitPlanPage"; // user quit plan
import MilestonesPage from "../pages/user/MilestonesPage";// user milestones
import Page from "../pages/user/test"; // user test page (Dashboard)
import UserButtonCoach from "../pages/user/UserButtonCoach"; // user coach button
import CoachDashboard from "../pages/user/CoachDashboard"; //  coach dashboard
// import ProfileOfCoach from "../pages/user/ProfileOfCoach"; // coach profile
import WrapperCoachProfile from "../routes/WrapperCoachProfile"; // coach profile wrapper


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

            <Route path={ROUTERS.USER.PACKAGE} element={
                <UserLayout>
                    < UserPackage />
                </UserLayout>
            } />

            <Route path={ROUTERS.USER.QUITPLAN} element={
                <UserLayout>
                    <QuitPlanPage />
                </UserLayout>
            } />

            <Route path={ROUTERS.USER.MILESTONES} element={
                <UserLayout>
                    <MilestonesPage />
                </UserLayout>
            } />
            <Route path={ROUTERS.USER.TEST} element={
                <UserLayout>
                    <Page />
                </UserLayout>
            } />
            <Route path={ROUTERS.USER.COACH} element={
                <UserLayout>
                    <UserButtonCoach />
                </UserLayout>
            } />
            {/* Coach dashboard */}
            <Route path={ROUTERS.USER.COACHDASHBOARD} element={
                <UserLayout>
                    <CoachDashboard />
                </UserLayout>
            } />
            {/* Profile of coach */}
            <Route path={ROUTERS.USER.COACHPROFILE} element={
                <UserLayout>
                    {/* <ProfileOfCoach /> */}
                    <WrapperCoachProfile />
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
