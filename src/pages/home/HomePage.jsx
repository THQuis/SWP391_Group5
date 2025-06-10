import { memo } from "react";
import "../home/home.scss";

const HomePage = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="hero" id="home">
                <img
                    src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/Banner.jpg?raw=true"
                    alt="banner"
                />
                <div className="container">
                    <div className="hero-content">
                        {/* bạn có thể thêm tiêu đề/btn tại đây */}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="container">
                    <h2>Về chúng tôi</h2>
                    <div className="about-content">
                        <div className="about-text">
                            <h3>BreathAgain</h3>
                            <p>không chỉ là một nền tảng hỗ trợ cai thuốc.</p>
                            <p>
                                Đó là nơi bắt đầu của một hành trình hồi sinh - cả về thể chất lẫn
                                tinh thần - dành cho hàng triệu người đang mắc kẹt trong lần khói thuốc.
                            </p>
                        </div>
                        <div className="about-image">🫁</div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <h2>Sứ mệnh của chúng tôi</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <h3>💚 Sứ mệnh của chúng tôi</h3>
                            <p>
                                Giúp lại hơi thở tự do, giúp người hút thuốc phục hồi sức khỏe một
                                cách toàn diện và lâu dài - không chỉ để bỏ thuốc, mà để có một
                                cuộc sống.
                            </p>
                        </div>
                        <div className="feature-card">
                            <h3>🌱 Chúng tôi đồng hành để bạn:</h3>
                            <ul>
                                <li>Sống khỏe mỗi ngày</li>
                                <li>Gắn kết lại với người thân</li>
                                <li>Truyền cảm hứng cho cộng đồng</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="support" id="support">
                <div className="container">
                    <h2>Ở đây chúng tôi sẽ giúp bạn:</h2>
                    <div className="support-cards">
                        <div className="support-card">
                            <div className="icon">📋</div>
                            <h3>Kế hoạch cai nghiện</h3>
                        </div>
                        <div className="support-card">
                            <div className="icon">📊</div>
                            <h3>Xem các blogger chia sẻ kinh nghiệm</h3>
                        </div>
                        <div className="support-card">
                            <div className="icon">👥</div>
                            <h3>Giao lưu với chuyên môn</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rankings Section */}
            <section className="rankings" id="rankings">
                <div className="container">
                    <h2>Bảng xếp hạng</h2>
                    <div className="rankings-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên người dùng</th>
                                    <th>Số ngày cai thuốc</th>
                                    <th>Huy hiệu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Người dùng 1</td>
                                    <td>365 ngày</td>
                                    <td>🏆</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Người dùng 2</td>
                                    <td>200 ngày</td>
                                    <td>🥈</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Người dùng 3</td>
                                    <td>150 ngày</td>
                                    <td>🥉</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta">
                <div className="container">
                    <h2>🌟 Bạn sẵn sàng thở lại chưa?</h2>
                    <p>
                        Hãy để BreathAgain đồng hành cùng bạn - không phán xét, không áp buộc,
                        chỉ có hiểu - hỗ trợ - và hy vọng.
                    </p>
                    <p>Vì một ngày không thuốc là một ngày bạn sống trọn vẹn hơn.</p>
                    <button className="cta-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        Bắt đầu hành trình
                    </button>
                </div>
            </section>
        </>
    );
};

export default memo(HomePage);
