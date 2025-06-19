// layouts/UserLayout.jsx
import Header from "../components/header";
import Footer from "../components/footer";

const UserLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{
                background: "linear-gradient(135deg, #e8f5e8 0%, #d4edd4 50%, #c1e6c1 100%)",
                minHeight: "100vh"  // đảm bảo background phủ toàn bộ
            }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default UserLayout;
