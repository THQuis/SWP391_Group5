// layouts/UserLayout.jsx
import HeaderAdmin from "../components/header/headerAdmin";
import Sidebar from "../components/header/sidebar";

const AdminLayout = ({ children }) => {
    return (
        <div>
            <Sidebar />
            <div style={{ marginLeft: 220 }}> {/* Đẩy nội dung sang phải */}
                <HeaderAdmin />
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
