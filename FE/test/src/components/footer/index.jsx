import { memo } from "react";
import "../footer/footer.css";


const Footer = () => {
    return (
        <footer>
            <div className="containerFoot">
                <p>© 2024 Breath Again. Tất cả quyền được bảo lưu.</p>
            </div>
        </footer>
    );
};

export default memo(Footer);
