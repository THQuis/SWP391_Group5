import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Button, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarPlus, FaCalendarCheck, FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import '../../styles/MyConsultations.scss';

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

const cancelBooking = async (bookingId) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`/api/user/consultation/cancel/${bookingId}`, {
        method: "DELETE",
        headers: {
            "Accept": "*/*",
            "Authorization": "Bearer " + token,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Hủy lịch thất bại.");
    }
    return data;
};

const statusMap = {
    "Pending": { label: "Chờ xác nhận", className: "badge bg-warning text-dark" },
    "Approved": { label: "Đã xác nhận", className: "badge bg-success" },
    "Confirmed": { label: "Đã xác nhận", className: "badge bg-success" },
    "Completed": { label: "Hoàn thành", className: "badge bg-primary" },
    "Reject": { label: "Từ chối", className: "badge bg-danger" },
    "Cancelled": { label: "Đã huỷ", className: "badge bg-secondary" },
};

const MyConsultations = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [activeTab, setActiveTab] = useState("Pending");
    const navigate = useNavigate();

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);

        const getBookings = async () => {
            setLoading(true);
            const data = await fetchMyBookings();
            setBookings(data);
            setLoading(false);
        };
        getBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        setCancellingId(bookingId);
        try {
            await cancelBooking(bookingId);
            toast.success("Hủy lịch thành công.");
            // Reload bookings
            const data = await fetchMyBookings();
            setBookings(data);
        } catch (err) {
            toast.error(err.message || "Hủy lịch thất bại.");
        } finally {
            setCancellingId(null);
        }
    };

    // Phân loại booking theo status
    const bookingsByStatus = {
        Pending: bookings.filter(b => b.status === "Pending"),
        Approved: bookings.filter(b => b.status === "Approved" || b.status === "Confirmed"),
        Completed: bookings.filter(b => b.status === "Completed"),
        Rejected: bookings.filter(b => b.status === "Rejected"),
        Cancelled: bookings.filter(b => b.status === "Cancelled"),
    };

    const renderTable = (bookingList, statusKey) => (
        <div className="table-responsive">
            <Table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên chuyên gia</th>
                        <th>Ngày tư vấn</th>
                        <th>Thời lượng (phút)</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {bookingList.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center text-muted">Không có lịch nào.</td>
                        </tr>
                    ) : bookingList.map((b, idx) => (
                        <tr key={b.bookingID}>
                            <td>{idx + 1}</td>
                            <td>{b.coachName}</td>
                            <td>
                                {(() => {
                                    const d = new Date(b.bookingDate);
                                    const date = d.toLocaleDateString('vi-VN');
                                    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                                    return `${date} ${time}`;
                                })()}
                            </td>
                            <td>{b.duration}</td>
                            <td>{b.notes}</td>
                            <td>
                                <span className={statusMap[b.status]?.className || "badge bg-secondary"}>
                                    {statusMap[b.status]?.label || b.status}
                                </span>
                                {/* Thêm nút MeetingLink ở tab Đã xác nhận nếu có meetingLink */}
                                {statusKey === "Approved" && b.meetingLink && (
                                    <Button
                                        size="sm"
                                        variant="outline-primary"
                                        className="ms-2 meeting-link-btn"
                                        onClick={() => window.open(b.meetingLink.startsWith("http") ? b.meetingLink : undefined, "_blank")}
                                        title={b.meetingLink}
                                        disabled={!b.meetingLink.startsWith("http")}
                                    >
                                        Link phòng họp
                                    </Button>
                                )}
                                {statusKey === "Pending" && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleCancel(b.bookingID)}
                                        disabled={cancellingId === b.bookingID}
                                        className="ms-2"
                                    >
                                        {cancellingId === b.bookingID
                                            ? <Spinner animation="border" size="sm" />
                                            : <><FaTrashAlt /> Hủy lịch</>
                                        }
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )

    return (
        <div className="consultations-page">
            <div className="consultations-container">
                {/* Header Section */}
                <div className="consultations-header">
                    <div className="header-content">
                        <div className="title-section">
                            <h1 className="main-title">
                                <FaCalendarCheck />
                                Lịch sử tư vấn
                            </h1>
                            <p className="subtitle">Quản lý và theo dõi các buổi tư vấn của bạn</p>
                        </div>
                        <div className="header-actions">
                            <Button
                                className="new-appointment-btn"
                                onClick={() => navigate('/User/coachList')}
                            >
                                <FaCalendarPlus />
                                Đặt lịch mới
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Card className="consultations-card">
                    <div className="card-body">
                        {loading ? (
                            <div className="loading-container">
                                <Spinner animation="border" className="spinner-border" />
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="empty-state">
                                <FaCalendarCheck className="empty-icon" />
                                <h3 className="empty-title">Chưa có lịch tư vấn nào</h3>
                                <p className="empty-subtitle">Bạn chưa đặt lịch tư vấn với chuyên gia nào. Hãy bắt đầu hành trình cải thiện sức khỏe của bạn!</p>
                                <Button
                                    className="empty-action-btn"
                                    onClick={() => navigate('/User/coachList')}
                                >
                                    <FaCalendarPlus />
                                    Đặt lịch tư vấn ngay
                                </Button>
                            </div>
                        ) : (
                            <Tabs
                                id="booking-status-tabs"
                                activeKey={activeTab}
                                onSelect={k => setActiveTab(k)}
                                className="mb-3"
                            >
                                <Tab eventKey="Pending" title="Chờ xác nhận">
                                    {renderTable(bookingsByStatus.Pending, "Pending")}
                                </Tab>
                                <Tab eventKey="Approved" title="Đã xác nhận">
                                    {renderTable(bookingsByStatus.Approved, "Approved")}
                                </Tab>
                                <Tab eventKey="Completed" title="Hoàn thành">
                                    {renderTable(bookingsByStatus.Completed, "Completed")}
                                </Tab>
                                <Tab eventKey="Rejected" title="Từ chối">
                                    {renderTable(bookingsByStatus.Rejected, "Reject")}
                                </Tab>
                                <Tab eventKey="Cancelled" title="Đã huỷ">
                                    {renderTable(bookingsByStatus.Cancelled, "Cancelled")}
                                </Tab>
                            </Tabs>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyConsultations;