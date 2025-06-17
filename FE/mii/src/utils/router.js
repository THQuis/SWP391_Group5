export const ROUTERS = {
    AUTH: {
        LOGIN: "/auth",
    },
    USER: {
        HOME: "/",
        PROFILE: "/User/profile",
        BLOG: "/User/blog",
        RANKING: "/User/ranking",
        PACKAGE: "/User/package",
        QUITPLAN: "/User/plan",
        MILESTONES: "/User/milestones",
        TEST: "/User/tientrinhAuto",
        COACH: "/User/coach",
        COACHDASHBOARD: "/User/coachdashboard",
        COACHPROFILE: "User/coach/profile/:id",
    },
    ADMIN: {
        DASHBOARD: "/admin",
        USER: "admin/users",
        BLOG: "admin/ManagementBlog",
        PACKAGE: "admin/ManagementPackage",
        ACHIVE: "admin/ManagementPerformance",
        PLAN: "admin/ManagementPlan",
        NOTIFICATION: "admin/ManagementNotification"
    },
};
