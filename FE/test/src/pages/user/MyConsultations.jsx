import React, { useEffect, useState } from "react";
import { Container, Card, Table, Spinner, Alert, Button, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarPlus, FaCalendarCheck, FaTrashAlt } from "react-icons/fa";
import { toast } from 'react-toastify';

const fetchMyBookings = async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/consultation/my-bookings`, {
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
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/consultation/cancel/${bookingId}`, {
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
        <Table responsive bordered hover>
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
                                    className="ms-2"
                                    style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}
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
    )

    return (
        <Container className="py-4">
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <h4 className="mb-4">
                        <FaCalendarCheck className="me-2" />
                        Lịch sử tư vấn của bạn
                    </h4>
                    {loading ? (
                        <div className="d-flex justify-content-center">
                            <Spinner animation="border" variant="success" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <Alert variant="info">
                            Bạn chưa có lịch tư vấn nào!
                            <Button
                                variant="primary"
                                className="ms-3"
                                onClick={() => navigate('/User/coachList')}
                            >
                                <FaCalendarPlus className="me-1" /> Đặt lịch tư vấn
                            </Button>
                        </Alert>
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
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MyConsultations;