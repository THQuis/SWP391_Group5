// layouts/UserLayout.jsx
import Header from "../components/header";
import Footer from "../components/footer";

const UserLayout = ({ children }) => {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default UserLayout;
