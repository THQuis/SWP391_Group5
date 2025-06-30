// ...phần import và code phía trên giữ nzzguyên...

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaTransgender, FaCalendarAlt, FaPhoneAlt, FaEnvelope, FaUserCheck, FaUserTimes, FaCalendarCheck } from "react-icons/fa";

const fetchMyBookings = async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch('/api/user/consultation/my-bookings', {
        headers: {
            "Accept": "*/*",
            "Authorization": "Bearer " + token,
        },
    });
    if (!response.ok) return [];
    return await response.json();
};
const fetchMyCoachId = async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch('/api/user/coach/my-coach', {
        headers: {
            "Accept": "*/*",
            "Authorization": "Bearer " + token,
        },
    });
    if (!response.ok) return null;
    const data = await response.json();
    // data.coach.userID hoặc data.coachId tuỳ BE trả về
    return (data.coach && data.coach.userID) || data.coachId || null;
};
const fetchCoachById = async (id) => {
    const token = localStorage.getItem("userToken");
    const response = await fetch(`/api/user/coach/${id}`, {
        headers: {
            "Accept": "*/*",
            "Authorization": "Bearer " + token, // Nếu BE yêu cầu, còn không thì bỏ dòng này đi
        },
    });
    if (!response.ok) throw new Error("Không tìm thấy thông tin huấn luyện viên");
    const data = await response.json();
    // data.coach là object coach trả về từ BE (theo ảnh 4)
    return {
        UserID: data.coach.userID,
        fullName: data.coach.fullName,
        email: data.coach.email,
        phoneNumber: data.coach.phoneNumber,
        profilePicture: data.coach.profilePicture || null,
        status: data.coach.status,
        description: data.coach.description || "",
        // Thêm các field khác nếu cần
    };
};

// API đặt lịch tư vấn
const bookConsultation = async (data) => {
    const token = localStorage.getItem("userToken");

    try {
        const response = await fetch('/api/user/consultation/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token, // Thêm dòng này
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || 'Đặt lịch thất bại');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

const CoachProfileForUser = () => {
    const { id } = useParams(); // Lấy ID của coach từ URL
    const navigate = useNavigate();

    const [coach, setCoach] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // TODO: Cần thêm logic để biết user đã chọn coach nào
    const [myChosenCoachId, setMyChosenCoachId] = useState(() => {
        const value = localStorage.getItem('coachId');
        return value ? parseInt(value, 10) : null;
    });

    // Modal state cho đặt lịch
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        consultationDate: '',
        consultationTime: '08:00:00', // Mặc định 8h sáng
        duration: 30,
        notes: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccessAlert, setBookingSuccessAlert] = useState(false);
    const [hasBookingWithThisCoach, setHasBookingWithThisCoach] = useState(false);
    // Hàm kiểm tra trạng thái còn hiệu lực
    const isActiveStatus = (status) =>
        status === "Pending" || status === "Confirmed" || status === "Chờ xác nhận" || status === "Đã xác nhận"; // tuỳ backend

    useEffect(() => {
        const getCoachProfile = async () => {
            setIsLoading(true);
            try {
                const coachData = await fetchCoachById(id);
                setCoach(coachData);

                // Lấy coachId thực tế của user từ BE
                const chosenId = await fetchMyCoachId();
                setMyChosenCoachId(chosenId);

                // Update luôn localStorage (nếu muốn sync)
                if (chosenId) {
                    localStorage.setItem('coachId', chosenId);
                } else {
                    localStorage.removeItem('coachId');
                }

                // Kiểm tra đã có booking với coach này chưa (còn hiệu lực)
                const bookings = await fetchMyBookings();
                const hasBooking = bookings.some(
                    b =>
                        // Tốt nhất nên so sánh bằng coachId nếu backend trả về
                        (b.coachId === coachData.UserID || b.coachName === coachData.fullName) &&
                        isActiveStatus(b.status)
                );
                setHasBookingWithThisCoach(hasBooking);

            } catch (e) {
                toast.error("Không tìm thấy thông tin huấn luyện viên.");
                navigate("/User/coachList");
            } finally {
                setIsLoading(false);
            }
        };
        if (id) getCoachProfile();
    }, [id, navigate]);

    // Xử lý các hành động (Chọn, Hủy, Đặt lịch) - Tạm thời chỉ hiện thông báo
    // API chọn coach cho user
    const chooseCoach = async (coachId) => {
        const token = localStorage.getItem("userToken");
        const response = await fetch(`/api/user/coach/choose/${coachId}`, {
            method: "POST",
            headers: {
                "Accept": "*/*",
                "Authorization": "Bearer " + token,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Chọn coach thất bại");
        }
        return data;
    };
    const handleChooseCoach = async () => {
        try {
            await chooseCoach(coach.UserID);
            setMyChosenCoachId(coach.UserID);
            localStorage.setItem('coachId', coach.UserID); // Thêm dòng này
            toast.success("Đã chọn huấn luyện viên thành công!");
        } catch (err) {
            toast.error(err.message || "Chọn coach thất bại");
        }
    };
    const handleUnchooseCoach = () => {
        setMyChosenCoachId(null);
        localStorage.removeItem('coachId'); // Thêm dòng này
        toast.info(`Đã hủy chọn Coach ${coach.fullName}.`);
    };
    const handleBookAppointment = () => {
        setShowBookingModal(true);
    };

    // Xử lý gửi form đặt lịch
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingLoading(true);
        try {
            await bookConsultation({
                coachId: coach.UserID,
                consultationDate: bookingData.consultationDate,
                consultationTime: bookingData.consultationTime,
                duration: Number(bookingData.duration),
                notes: bookingData.notes
            });
            toast.success('Đặt lịch tư vấn thành công!');
            setHasBookingWithThisCoach(true);
            setShowBookingModal(false);
            setBookingData({
                consultationDate: '',
                consultationTime: '00:00:00',
                duration: 30,
                notes: ''
            });
            // Thêm dòng này:
            setBookingSuccessAlert(true);
            // Ẩn alert sau 4 giây (tuỳ chọn)
            setTimeout(() => setBookingSuccessAlert(false), 4000);
        } catch (err) {
            toast.error(err.message || 'Đặt lịch thất bại, vui lòng thử lại!');
        } finally {
            setBookingLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải hồ sơ chuyên gia...</h4>
            </Container>
        );
    }

    if (!coach) {
        return (
            <Container className="text-center mt-5">
                <Alert variant="danger">Không thể tải được thông tin của chuyên gia.</Alert>
            </Container>
        )
    }

    // Biến để kiểm tra trạng thái chọn coach
    const isThisCoachChosen = myChosenCoachId === coach.UserID;
    const hasChosenAnyCoach = myChosenCoachId !== null;

    return (
        <Container fluid className="py-4" style={{ background: "#d5f5df", minHeight: "100vh" }}>
            {/* Profile Card */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body className="d-flex flex-column flex-md-row align-items-center justify-content-center p-4 gap-4" style={{ minHeight: 230 }}>
                    <div className="text-center mb-2 mb-md-0">
                        <img
                            src={coach.profilePicture || `https://github.com/THQuis/SWP391_Group5/blob/main/image/user.png?raw=true`}
                            alt="Avatar"
                            className="rounded-circle border border-3 border-success shadow"
                            style={{ width: '140px', height: '140px', objectFit: 'cover', background: "#fff" }}
                        />
                    </div>
                    <div className="flex-grow-1 text-center text-md-start">
                        <h2 className="fw-bold mb-2" style={{ lineHeight: 1.2 }}>{coach.fullName}</h2>
                        <div className="mb-1" style={{ fontSize: "1.13rem", color: "#555", lineHeight: 1.6 }}>
                            <span style={{ color: "#4d4d4d", fontWeight: 500 }}>Tiểu sử:&nbsp;</span>
                            <span>{coach.description || <span className="fst-italic text-muted">Chưa có tiểu sử.</span>}</span>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Thông tin cá nhân của Coach */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body style={{ background: "#fff", borderRadius: 22, padding: "2rem" }}>
                    <h5 className="mb-4" style={{ color: "#3d1877", fontWeight: 700, letterSpacing: 1 }}>
                        <FaUser className="me-2" /> Thông tin chuyên gia
                    </h5>
                    <Row style={{ fontSize: "1.08rem", lineHeight: 2 }}>
                        <Col md={6} xs={12}>
                            <div className="d-flex align-items-center mb-2">
                                <FaEnvelope className="me-2" /><strong>Email:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{coach.email}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaPhoneAlt className="me-2" /><strong>Số điện thoại:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{coach.phoneNumber}</span>
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <div className="d-flex align-items-center mb-2">
                                <FaTransgender className="me-2" /><strong>Giới tính:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{coach.gender === 'Male' ? 'Nữ' : 'Nam'}</span>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaCalendarAlt className="me-2" /><strong>Ngày tham gia:</strong>
                                <span className="ms-2" style={{ color: "#222" }}>{new Date(coach.registrationDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* THÊM MỚI: Khu vực các nút hành động */}
            <Card className="mb-4 mx-auto shadow-sm border-0" style={{ borderRadius: 22, maxWidth: 900 }}>
                <Card.Body className="text-center">
                    <h5 className="mb-3">Tương tác với chuyên gia</h5>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        {/* Nếu user đã chọn coach này */}
                        {isThisCoachChosen && (
                            <Button variant="danger" size="lg" onClick={handleUnchooseCoach}>
                                <FaUserTimes className="me-2" /> Hủy chọn
                            </Button>
                        )}

                        {/* Nếu user chưa chọn coach nào */}
                        {!hasChosenAnyCoach && (
                            <Button variant="primary" size="lg" onClick={handleChooseCoach}>
                                <FaUserCheck className="me-2" /> Chọn làm người đồng hành
                            </Button>
                        )}

                        {/* Nút đặt lịch chỉ sáng khi user đã chọn coach này */}
                        {isThisCoachChosen && !hasBookingWithThisCoach && (
                            <Button variant="success" size="lg" onClick={handleBookAppointment}>
                                <FaCalendarCheck className="me-2" /> Đặt lịch tư vấn
                            </Button>
                        )}
                        {isThisCoachChosen && hasBookingWithThisCoach && (
                            <Button variant="info" size="lg" onClick={() => navigate("/User/MyConsultations")}>
                                <FaCalendarCheck className="me-2" /> Lịch tư vấn của tôi
                            </Button>
                        )}
                    </div>
                    {/* Thông báo nếu user đã chọn coach khác */}
                    {hasChosenAnyCoach && !isThisCoachChosen && (
                        <Alert variant="warning" className="mt-3">
                            Bạn đã có một chuyên gia đồng hành khác. Vui lòng hủy chọn chuyên gia hiện tại trước khi chọn người mới.
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            {/* Modal đặt lịch tư vấn */}
            <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} centered>
                <Form onSubmit={handleBookingSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Đặt lịch tư vấn với {coach.fullName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày tư vấn</Form.Label>
                            <Form.Control
                                type="date"
                                required
                                value={bookingData.consultationDate}
                                onChange={e => setBookingData({ ...bookingData, consultationDate: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giờ bắt đầu</Form.Label>
                            <Form.Control
                                type="time"
                                required
                                value={bookingData.consultationTime ? bookingData.consultationTime.slice(0, 5) : "12:00"}
                                onChange={e => setBookingData({ ...bookingData, consultationTime: e.target.value + ':00' })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời lượng (phút)</Form.Label>
                            <Form.Control
                                type="number"
                                min={15}
                                max={180}
                                step={15}
                                required
                                value={bookingData.duration}
                                onChange={e => setBookingData({ ...bookingData, duration: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú (tuỳ chọn)</Form.Label>
                            <Form.Control
                                type="time"
                                required
                                min="08:00"
                                max="22:00"
                                value={bookingData.consultationTime ? bookingData.consultationTime.slice(0, 5) : "12:00"}
                                onChange={e => setBookingData({ ...bookingData, consultationTime: e.target.value + ':00' })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowBookingModal(false)} disabled={bookingLoading}>
                            Đóng
                        </Button>
                        <Button variant="success" type="submit" disabled={bookingLoading}>
                            {bookingLoading ? <Spinner animation="border" size="sm" /> : 'Đặt lịch'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default CoachProfileForUser;