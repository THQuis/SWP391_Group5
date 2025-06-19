import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, ToastContainer } from 'react-bootstrap';
import "../../styles/Auth.scss";

//=================================================================
// Component con cho Đồng hồ đếm ngược
//=================================================================
const CountdownTimer = ({ initialTime, onTimeout }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeout();
            return;
        }
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeout]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="auth-countdown-timer">
            Mã OTP sẽ hết hạn sau: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
    );
};

//=================================================================
// Component chính: AuthPage
//=================================================================
const AuthPage = () => {
    const navigate = useNavigate();

    // --- STATES ---
    const [isLoading, setIsLoading] = useState(false);

    // State cho tab chính
    const [activeTab, setActiveTab] = useState('login');
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    // State cho luồng Đăng ký
    const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', agree: false });
    const [showRegisterOTP, setShowRegisterOTP] = useState(false);
    const [registerOtp, setRegisterOtp] = useState('');

    // State cho luồng Quên Mật khẩu
    const [viewMode, setViewMode] = useState('auth');
    const [forgotPasswordStep, setForgotPasswordStep] = useState('enterEmail');
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotOtp, setForgotOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isOtpExpired, setIsOtpExpired] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [pendingNavigate, setPendingNavigate] = useState(null);

    // --- HÀM XỬ LÝ SỰ KIỆN ---
    const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setRegisterForm(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setRegisterForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    // 1. ĐĂNG NHẬP
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setToast({ show: false, message: '', type: 'success' });
        setPendingNavigate(null);
        try {
            const res = await fetch(`/api/Auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Đăng nhập không thành công.');
            }

            setToast({ show: true, message: 'Đăng nhập thành công!', type: 'success' });
            const userRole = data.user.roleID;
            const userName = data.user.fullName;
            const userEmail = data.user.email;
            const userId = data.user.userID;

            localStorage.setItem('userToken', data.token);
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', userEmail);
            localStorage.setItem('userId', userId);

            setPendingNavigate(userRole === 1 ? '/admin' : '/User/progress');
        } catch (error) {
            setToast({ show: true, message: '❌ Lỗi: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (toast.show && toast.type === 'success' && pendingNavigate) {
            const t = setTimeout(() => {
                setToast({ ...toast, show: false });
                navigate(pendingNavigate);
            }, 1500);
            return () => clearTimeout(t);
        }
    }, [toast, pendingNavigate, navigate]);

    // 2. ĐĂNG KÝ (BƯỚC 1 - GỬI THÔNG TIN)
    const handleRegister = async (e) => {
        e.preventDefault();
        if (registerForm.password !== registerForm.confirmPassword) {
            setToast({ show: true, message: '❗ Mật khẩu xác nhận không khớp!', type: 'error' });
            return;
        }
        if (!registerForm.agree) {
            setToast({ show: true, message: '❗ Bạn cần đồng ý với điều khoản sử dụng.', type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/Auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: registerForm.name,
                    email: registerForm.email,
                    password: registerForm.password,
                    confirmPassword: registerForm.confirmPassword,
                    phoneNumber: registerForm.phone
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || `Đăng ký thất bại với mã lỗi ${res.status}`);
            }

            setToast({ show: true, message: 'Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.', type: 'success' });
            setShowRegisterOTP(true);

        } catch (error) {
            setToast({ show: true, message: '❌ Lỗi: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // 3. ĐĂNG KÝ (BƯỚC 2 - XÁC THỰC OTP ĐĂNG KÝ)
    const handleVerifyRegisterOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`/api/Auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registerForm.email, otpCode: registerOtp })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Xác thực OTP không thành công.');
            }
            setToast({ show: true, message: 'Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.', type: 'success' });
            setShowRegisterOTP(false);
            setRegisterForm({ name: '', email: '', password: '', confirmPassword: '', phone: '', agree: false });
            setRegisterOtp('');
            setActiveTab('login');
        } catch (error) {
            setToast({ show: true, message: '❌ Lỗi: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // 4. QUÊN MẬT KHẨU (BƯỚC 1 - YÊU CẦU OTP)
    const handleForgotPasswordRequest = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`/api/Auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Email không tồn tại trong hệ thống.');
            }
            setToast({ show: true, message: data.message, type: 'success' });
            setIsOtpExpired(false);
            setForgotPasswordStep('enterOTP');
        } catch (error) {
            setToast({ show: true, message: '❌ Lỗi: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // 5. QUÊN MẬT KHẨU (BƯỚC 2 - XÁC THỰC OTP RESET)
    const handleVerifyResetOTP = async (e) => {
        e.preventDefault();
        if (isOtpExpired) {
            setToast({ show: true, message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.', type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/Auth/verify-reset-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, otpCode: forgotOtp })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Mã OTP không chính xác.');
            }
            setToast({ show: true, message: data.message, type: 'success' });
            setForgotPasswordStep('resetPassword');
        } catch (error) {
            setToast({ show: true, message: '❌ Lỗi: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    // 6. QUÊN MẬT KHẨU (BƯỚC 3 - ĐẶT LẠI MẬT KHẨU MỚI)
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setToast({ show: true, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.', type: 'error' });
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setToast({ show: true, message: 'Mật khẩu xác nhận không khớp!', type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(`/api/Auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotEmail, newPassword: newPassword })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Không thể đặt lại mật khẩu.');
            }
            setToast({ show: true, message: data.message + ' Vui lòng đăng nhập lại.', type: 'success' });
            goBackToLogin(true);
        } catch (error) {
            setToast({ show: true, message: '❌ Lỗi: ' + error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const goBackToLogin = (switchToLoginTab = false) => {
        setViewMode('auth');
        setForgotPasswordStep('enterEmail');
        setForgotEmail('');
        setForgotOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        if (switchToLoginTab) setActiveTab('login');
    };

    // --- RENDER FUNCTIONS ---

    const renderForgotPasswordFlow = () => (
        <div className="auth-forgot-password-flow">
            <a href="#" onClick={(e) => { e.preventDefault(); goBackToLogin() }} className="auth-back-link">Quay lại đăng nhập</a>

            {forgotPasswordStep === 'enterEmail' && (
                <form onSubmit={handleForgotPasswordRequest}>
                    <h3 className="auth-form-subtitle">Quên mật khẩu?</h3>
                    <p className="auth-form-instruction">Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
                    <div className="auth-form-group">
                        <label>Địa chỉ email</label>
                        <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required placeholder="Nhập email của bạn" />
                    </div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>{isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}</button>
                </form>
            )}

            {forgotPasswordStep === 'enterOTP' && (
                <form onSubmit={handleVerifyResetOTP}>
                    <h3 className="auth-form-subtitle">Xác thực OTP</h3>
                    <p className="auth-form-instruction">Một mã xác thực đã được gửi đến <strong>{forgotEmail}</strong>.</p>
                    <div className="auth-form-group">
                        <label>Mã OTP</label>
                        <input type="text" value={forgotOtp} onChange={(e) => setForgotOtp(e.target.value)} required placeholder="Nhập mã OTP" />
                    </div>
                    {!isOtpExpired ? <CountdownTimer initialTime={300} onTimeout={() => setIsOtpExpired(true)} /> : <div className="auth-countdown-timer expired">Mã OTP đã hết hạn!</div>}
                    <button type="submit" className="auth-btn" disabled={isLoading || isOtpExpired}>{isLoading ? 'Đang xác thực...' : 'Xác nhận'}</button>
                    <a href="#" onClick={(e) => { e.preventDefault(); setForgotPasswordStep('enterEmail') }} className="auth-resend-link">Không nhận được mã? Gửi lại.</a>
                </form>
            )}

            {forgotPasswordStep === 'resetPassword' && (
                <form onSubmit={handleResetPassword}>
                    <h3 className="auth-form-subtitle">Tạo mật khẩu mới</h3>
                    <div className="auth-form-group"><label>Mật khẩu mới</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="Nhập mật khẩu mới" /></div>
                    <div className="auth-form-group"><label>Xác nhận mật khẩu mới</label><input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required placeholder="Nhập lại mật khẩu mới" /></div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>{isLoading ? 'Đang lưu...' : 'Lưu mật khẩu'}</button>
                </form>
            )}
        </div>
    );

    const renderAuthTabs = () => (
        <>
            <h2 className="auth-form-title">Chào mừng bạn</h2>
            <div className="auth-form-tabs"><div className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Đăng nhập</div><div className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Đăng ký</div></div>

            {activeTab === 'login' && (
                <form onSubmit={handleLogin}>
                    <div className="auth-form-group"><label>Email</label><input type="email" name="email" required value={loginForm.email} onChange={handleLoginChange} placeholder="Nhập email của bạn" /></div>
                    <div className="auth-form-group"><label>Mật khẩu</label><input type="password" name="password" required value={loginForm.password} onChange={handleLoginChange} placeholder="Nhập mật khẩu" /></div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
                    <div className="auth-forgot-password"><a href="#" onClick={(e) => { e.preventDefault(); setViewMode('forgotPassword'); }}>Quên mật khẩu?</a></div>
                </form>
            )}

            {activeTab === 'register' && !showRegisterOTP && (
                <form onSubmit={handleRegister}>
                    <div className="auth-form-group"><label>Họ và tên</label><input type="text" name="name" required value={registerForm.name} onChange={handleRegisterChange} placeholder="Nhập họ và tên" /></div>
                    <div className="auth-form-group"><label>Email</label><input type="email" name="email" required value={registerForm.email} onChange={handleRegisterChange} placeholder="Nhập email của bạn" /></div>
                    <div className="auth-form-group"><label>Mật khẩu</label><input type="password" name="password" required value={registerForm.password} onChange={handleRegisterChange} placeholder="Tạo mật khẩu mạnh" /></div>
                    <div className="auth-form-group"><label>Xác nhận mật khẩu</label><input type="password" name="confirmPassword" required value={registerForm.confirmPassword} onChange={handleRegisterChange} placeholder="Nhập lại mật khẩu" /></div>
                    <div className="auth-form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="phone"
                            required
                            value={registerForm.phone}
                            onChange={handleRegisterChange}
                            placeholder="Nhập số điện thoại"
                        />
                    </div>
                    <div className="auth-checkbox-group"><input type="checkbox" id="agreeTerms" name="agree" checked={registerForm.agree} onChange={handleRegisterChange} /><label htmlFor="agreeTerms">Tôi đồng ý với <a href="#">Điều khoản sử dụng</a></label></div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>{isLoading ? 'Đang đăng ký...' : 'Đăng ký ngay'}</button>
                </form>
            )}

            {activeTab === 'register' && showRegisterOTP && (
                <form onSubmit={handleVerifyRegisterOTP}>
                    <h3 className="auth-form-subtitle">Xác thực tài khoản</h3>
                    <p className="auth-form-instruction">Một mã xác thực đã được gửi đến <strong>{registerForm.email}</strong> để kích hoạt tài khoản.</p>
                    <div className="auth-form-group"><label>Mã OTP</label><input type="text" value={registerOtp} onChange={(e) => setRegisterOtp(e.target.value)} required placeholder="Nhập mã OTP" /></div>
                    <button type="submit" className="auth-btn" disabled={isLoading}>{isLoading ? 'Đang xác thực...' : 'Kích hoạt tài khoản'}</button>
                </form>
            )}
        </>
    );

    // --- MAIN JSX STRUCTURE ---
    return (
        <div className="auth-page">
            {/* Thông báo dạng toast, màu xanh mint, chữ đen */}
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                    delay={1800}
                    autohide
                    style={{
                        minWidth: 320,
                        fontSize: "1.08rem",
                        background: "#C1DCDC",
                        color: "#212529",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        borderRadius: "12px",
                        border: "none",
                        padding: "14px 22px"
                    }}
                >
                    <Toast.Body style={{ color: "#212529", fontWeight: 500 }}>
                        {toast.message}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
            <div className="auth-container-wrapper">
                <div className="auth-left-panel">
                    <div className="auth-logo"><img src="https://github.com/THQuis/SWP391_Group5/blob/main/image/logo.png?raw=true" alt="BreathAgain" /></div>
                    <div className="auth-tagline">Hành trình cai nghiện thuốc lá bắt đầu từ đây</div>
                    <ul className="auth-features">
                        <li>Theo dõi tiến trình cai nghiện hàng ngày</li><li>Nhận lời khuyên từ chuyên gia</li><li>Kết nối với cộng đồng hỗ trợ</li>
                        <li>Tính toán tiền tiết kiệm được</li><li>Nhắc nhở và động viên liên tục</li><li>Báo cáo sức khỏe chi tiết</li>
                    </ul>
                </div>
                <div className="auth-right-panel">
                    <div className="auth-form-container">
                        {viewMode === 'auth' ? renderAuthTabs() : renderForgotPasswordFlow()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;