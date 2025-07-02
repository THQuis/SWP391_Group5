import { memo } from "react";
import { Carousel } from 'react-bootstrap';
import "../../styles/home.scss";
import { Link } from 'react-router-dom';
import { ROUTERS } from "../../utils/router";

const HomePage = () => {
    return (
        <div>
            <section className="hero-carousel" id="home">
                <Carousel fade controls={false} indicators={false} interval={1000}>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://github.com/THQuis/SWP391_Group5/blob/Qui2/image/banner_Ko_nicotin.png?raw=true"
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://github.com/THQuis/SWP391_Group5/blob/main/image/Thien1.2.jpg?raw=true"
                            alt="Second slide"
                        />

                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://github.com/THQuis/SWP391_Group5/blob/main/image/Coach.png?raw=true"
                            alt="Third slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="https://github.com/THQuis/SWP391_Group5/blob/main/image/banner1.1.jpg?raw=true"
                            alt="Four slide"

                        />
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="container">
                    <h2>Về chúng tôi</h2>
                    <div className="about-content">
                        <div className="about-text">
                            <h3>BreathAgain</h3>
                            <p>Hãy để BreathAgain đồng hành cùng bạn trên con đường vượt qua sự phụ thuộc vào thuốc lá. Chúng tôi tin rằng mỗi người đều xứng đáng có một cuộc sống khỏe mạnh hơn, tự do hơn và hạnh phúc hơn. Tại đây, bạn sẽ nhận được không chỉ là các công cụ hỗ trợ, mà còn là sự động viên, chia sẻ từ cộng đồng cũng như những lời khuyên tận tâm từ các chuyên gia.</p>
                            <p>
                                Bạn không đơn độc trên hành trình này! Hàng ngàn người đã và đang thành công nhờ sự giúp đỡ của BreathAgain. Mỗi bước tiến nhỏ của bạn sẽ được ghi nhận, mỗi thành tựu của bạn sẽ được tôn vinh và lan tỏa để truyền cảm hứng cho những người khác.
                            </p>
                            <p>
                                Hãy bắt đầu thay đổi vì chính bạn, vì những người thân yêu và vì tương lai không còn khói thuốc. BreathAgain – Khơi lại một cuộc sống mới, khỏe mạnh hơn từng ngày cùng bạn!


                            </p>
                        </div>
                        <img
                            className="d-block w-100"
                            src="https://github.com/THQuis/SWP391_Group5/blob/main/image/banner1.3.jpg?raw=true"
                        // alt="First slide"
                        />

                        {/* <div className="about-image"><img src="https://github.com/THQuis/SWP391_Group5/blob/main/image/Phoi4.png?raw=true" alt=""/></div> */}

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
                                Chúng tôi luôn tin rằng, mỗi hành trình thay đổi bắt đầu từ một quyết tâm nhỏ. BreathAgain không chỉ đồng hành cùng bạn trên con đường cai nghiện thuốc lá mà còn là người bạn hỗ trợ, cổ vũ bạn mỗi ngày. Mỗi thành tựu dù nhỏ nhất của bạn đều được ghi nhận, mỗi khó khăn bạn gặp phải đều có cộng đồng chia sẻ và động viên.
                            </p>
                            <p>
                                Đừng để thuốc lá lấy đi sức khỏe, hạnh phúc và những khoảnh khắc quý giá bên gia đình. Hãy để chúng tôi giúp bạn sống khỏe mạnh hơn, gắn kết hơn và truyền cảm hứng cho những người xung quanh. Hãy bắt đầu hành trình mới - vì bạn, vì người thân yêu, và vì cả cộng đồng. BreathAgain – nơi mọi thay đổi đều được trân trọng và hỗ trợ không ngừng!
                            </p>
                        </div>
                        <div className="feature-card">
                            <h3>🌱 Chúng tôi đồng hành để bạn:</h3>
                            <ul>
                                <li>Sống khỏe mỗi ngày: Bạn sẽ cảm nhận rõ sự thay đổi tích cực của cơ thể và tinh thần sau từng ngày không còn khói thuốc, để mỗi ngày trôi qua là một ngày khỏe mạnh hơn, tươi mới hơn.</li>
                                <li>Gắn kết lại với người thân: Cai nghiện thuốc lá không chỉ vì chính bạn mà còn cho những người bạn yêu thương. Hãy lấy lại những khoảnh khắc quý giá bên gia đình và bạn bè, cùng nhau tận hưởng cuộc sống trọn vẹn.</li>
                                <li>Truyền cảm hứng cho cộng đồng: Câu chuyện thay đổi của bạn sẽ là động lực mạnh mẽ cho những người xung quanh. Chúng tôi khuyến khích bạn chia sẻ thành tựu, kinh nghiệm và lan tỏa niềm tin vào cuộc sống không khói thuốc.</li>
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
                        <Link to={ROUTERS.USER.QUITPLAN} className="support-card">
                            <div className="icon">📋</div>
                            <h3>Kế hoạch cai nghiện</h3>
                        </Link>
                        <Link to={ROUTERS.USER.BLOG} className="support-card">
                            <div className="icon">📊</div>
                            <h3>Xem các blogger chia sẻ kinh nghiệm</h3>
                        </Link>

                        <Link to={ROUTERS.USER.COACH} className="support-card">
                            <div className="icon">👥</div>
                            <h3>Giao lưu với chuyên môn</h3>
                        </Link>
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
        </div>
    );
};

export default memo(HomePage);