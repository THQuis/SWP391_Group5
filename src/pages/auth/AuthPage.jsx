import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../auth/Auth.css";

const AuthPage = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('login');
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
        agree: false,
    });
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOTP] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            });

            const data = await res.json();
            if (!res.ok) return alert('❌ ' + data.message);

            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('token', data.token);// nếu server trả về token
            localStorage.setItem('role', data.role); // nếu có phân quyền
            alert('✅ ' + data.message);

            // Điều hướng sau khi đăng nhập thành công
            const role = data.role;

            if (role === 'Admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }

        } catch {
            alert('⚠ Lỗi kết nối đến máy chủ');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) return alert('❗ Mật khẩu xác nhận không khớp!');
        if (!form.agree) return alert('❗ Bạn cần đồng ý với điều khoản.');

        try {
            const res = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: form.name, email: form.email, password: form.password })
            });
            const data = await res.json();
            if (!res.ok) return alert('❌ ' + data.message);
            setShowOTP(true);
        } catch {
            alert('⚠ Lỗi kết nối đến máy chủ');
        }
    };

    const handleOTPSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, otp })
            });
            const data = await res.json();
            if (!res.ok) return alert('❌ ' + data.message);
            alert('✅ Xác minh thành công!');
            setShowOTP(false);
        } catch {
            alert('⚠ Lỗi khi xác minh OTP');
        }
    };

    return (

        <div className="auth-page">
            <div className="auth-container-wrapper ">
                <div className="auth-left-panel">
                    <div className="auth-logo">
                        <img src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/logo.png?raw=true" alt="BreathAgain" />
                    </div>
                    <div className="auth-tagline">Hành trình cai nghiện thuốc lá bắt đầu từ đây</div>
                    <ul className="auth-features">
                        <li>Theo dõi tiến trình cai nghiện hàng ngày</li>
                        <li>Nhận lời khuyên từ chuyên gia</li>
                        <li>Kết nối với cộng đồng hỗ trợ</li>
                        <li>Tính toán tiền tiết kiệm được</li>
                        <li>Nhắc nhở và động viên liên tục</li>
                        <li>Báo cáo sức khỏe chi tiết</li>
                    </ul>
                </div>

                <div className="auth-right-panel">
                    <div className="auth-form-container">
                        <h2 className="auth-form-title">Chào mừng bạn</h2>

                        <div className="auth-form-tabs">
                            <div className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Đăng nhập</div>
                            <div className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Đăng ký</div>
                        </div>

                        {activeTab === 'login' ? (
                            <div className="auth-form-container active">
                                <form onSubmit={handleLogin}>
                                    <div className="auth-form-group">
                                        <label>Email</label>
                                        <input type="email" name="email" required onChange={handleChange} placeholder="Nhập email của bạn" />
                                    </div>
                                    <div className="auth-form-group">
                                        <label>Mật khẩu</label>
                                        <input type="password" name="password" required onChange={handleChange} placeholder="Nhập mật khẩu" />
                                    </div>
                                    <button type="submit" className="auth-btn">Đăng nhập</button>
                                </form>
                                <div className="auth-forgot-password"><a href="#">Quên mật khẩu?</a></div>
                            </div>
                        ) : (
                            <div className="auth-form-container active">
                                {!showOTP ? (
                                    <form onSubmit={handleRegister}>
                                        <div className="auth-form-group">
                                            <label>Họ và tên</label>
                                            <input type="text" name="name" required onChange={handleChange} placeholder="Nhập họ và tên" />
                                        </div>
                                        <div className="auth-form-group">
                                            <label>Email</label>
                                            <input type="email" name="email" required onChange={handleChange} placeholder="Nhập email của bạn" />
                                        </div>
                                        <div className="auth-form-group">
                                            <label>Mật khẩu</label>
                                            <input type="password" name="password" required onChange={handleChange} placeholder="Tạo mật khẩu mạnh" />
                                        </div>
                                        <div className="auth-form-group">
                                            <label>Xác nhận mật khẩu</label>
                                            <input type="password" name="confirmPassword" required onChange={handleChange} placeholder="Nhập lại mật khẩu" />
                                        </div>
                                        <div className="auth-checkbox-group">
                                            <input type="checkbox" id="agreeTerms" name="agree" onChange={handleChange} />
                                            <label htmlFor="agreeTerms">Tôi đồng ý với <a href="#">Điều khoản sử dụng</a></label>
                                        </div>
                                        <button type="submit" className="auth-btn">Đăng ký ngay</button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleOTPSubmit}>
                                        <div className="auth-form-group">
                                            <label>Nhập mã OTP đã gửi đến email</label>
                                            <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} placeholder="Nhập mã OTP" required />
                                        </div>
                                        <button type="submit" className="auth-btn">Xác minh OTP</button>
                                    </form>
                                )}
                            </div>
                        )}

                        <div className="auth-divider"><span>Hoặc tiếp tục với</span></div>
                        <div className="auth-social-login">
                            <button className="auth-social-btn">
                                <img src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/search.png?raw=true" alt="Google" width="20" height="20" /> Google
                            </button>
                            <button className="auth-social-btn">
                                <img src="https://github.com/THQuis/SWP391_Group5/blob/main/Frontend/image/facebook.png?raw=true" alt="Facebook" width="20" height="20" /> Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
