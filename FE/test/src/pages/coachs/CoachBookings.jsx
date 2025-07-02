import React, { useState, useEffect } from "react";
import {
    Container, Card, Table, Button, Spinner, Modal, Tabs, Tab, Form
} from "react-bootstrap";
import { toast } from "react-toastify";
import apiFetch from '../../utils/apiFetch';
// Modal xác nhận lịch tư vấn (chỉ để duyệt hoặc từ chối)
function BookingActionModal({ show, onHide, booking, onApprove, onReject, loading }) {
    if (!booking) return null;
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận lịch tư vấn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    Bạn muốn <b>nhận</b> lịch tư vấn với <b>{booking.userName}</b> vào lúc <b>{booking.bookingDate?.slice(0, 10)} {booking.time || ""}</b>?
                </p>
                <div className="mb-2">
                    <div><b>Ghi chú:</b> {booking.notes}</div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onReject} disabled={loading}>Từ chối</Button>
                <Button variant="success" onClick={onApprove} disabled={loading}>Nhận lịch & Gửi thông tin</Button>
            </Modal.Footer>
        </Modal>
    );
}

// Modal gửi (hoặc cập nhật) thông tin cho member
function SendInfoModal({ show, onHide, booking, onSend, loading, isUpdate }) {
    const [meetingLink, setMeetingLink] = useState("");
    const [coachNotes, setCoachNotes] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState("");

    useEffect(() => {
        if (show && booking) {
            setMeetingLink(booking.meetingLink || "");
            setCoachNotes(booking.coachNotes || "");
            setPreferredLanguage(booking.preferredLanguage || "");
        }
    }, [show, booking]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend({
            meetingLink,
            coachNotes,
            preferredLanguage,
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{isUpdate ? "Cập nhật thông tin cho thành viên" : "Gửi thông tin cho thành viên"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Link phòng họp (Meeting link)</Form.Label>
                        <Form.Control
                            type="text"
                            value={meetingLink}
                            onChange={e => setMeetingLink(e.target.value)}
                            placeholder="Nhập link phòng họp (Zoom, Google Meet...)"
                        />
                    </Form.Group>
                    {/* <Form.Group className="mb-3">
                        <Form.Label>Ghi chú của Coach</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={coachNotes}
                            onChange={e => setCoachNotes(e.target.value)}
                            placeholder="Nhập ghi chú gửi tới thành viên..."
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ngôn ngữ tư vấn (Preferred language)</Form.Label>
                        <Form.Control
                            type="text"
                            value={preferredLanguage}
                            onChange={e => setPreferredLanguage(e.target.value)}
                            placeholder="VD: Vietnamese, English..."
                        />
                    </Form.Group> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide} disabled={loading}>Đóng</Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : isUpdate ? "Cập nhật" : "Gửi thông tin"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

const STATUS_MAP = {
    Pending: { label: "Chờ xác nhận", className: "badge bg-warning text-dark" },
    Approved: { label: "Đã xác nhận", className: "badge bg-success" },
    Confirmed: { label: "Đã xác nhận", className: "badge bg-success" },
    Completed: { label: "Hoàn thành", className: "badge bg-primary" },
    Reject: { label: "Từ chối", className: "badge bg-danger" },
    Cancelled: { label: "Đã huỷ", className: "badge bg-secondary" },
};

const CoachBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & action state
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showSendInfoModal, setShowSendInfoModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);

    // Tab control
    const [activeTab, setActiveTab] = useState("Pending");
    // Gửi info: phân biệt gửi mới (approve) hay cập nhật (update)
    const [sendInfoIsUpdate, setSendInfoIsUpdate] = useState(false);

    // API lấy danh sách lịch
    const fetchBookings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const response = await apiFetch("/api/coach/consultation/my-appointments", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu lịch tư vấn");
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            setBookings([]);
            toast.error(error.message || "Lỗi kết nối server khi tải lịch tư vấn!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Khi bấm Duyệt/Từ chối ở tab Pending
    const handleClickBooking = (booking) => {
        setSelectedBooking(booking);
        setShowBookingModal(true);
    };

    // Duyệt lịch → mở modal gửi thông tin
    const handleApproveBooking = () => {
        setShowBookingModal(false);
        setSendInfoIsUpdate(false); // gửi info mới (approve)
        setTimeout(() => setShowSendInfoModal(true), 300);
    };

    // Gửi thông tin khi duyệt (approve)
    const handleApproveAndSendInfo = async (info) => {
        if (!selectedBooking) return;
        setInfoLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const response = await apiFetch(`/api/coach/consultation/approve/${selectedBooking.bookingID}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi khi duyệt lịch!");
            toast.success(data.message || "Duyệt lịch thành công!");
            setShowSendInfoModal(false);
            fetchBookings();
        } catch (error) {
            toast.error(error.message || "Lỗi khi duyệt lịch!");
        } finally {
            setInfoLoading(false);
        }
    };

    // Từ chối lịch
    const handleRejectBooking = async () => {
        if (!selectedBooking) return;
        setActionLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const response = await apiFetch(`/api/coach/consultation/reject/${selectedBooking.bookingID}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi khi từ chối lịch!");
            toast.success(data.message || "Từ chối lịch thành công!");
            setShowBookingModal(false);
            fetchBookings();
        } catch (error) {
            toast.error(error.message || "Lỗi khi từ chối lịch!");
        } finally {
            setActionLoading(false);
        }
    };

    // Hoàn thành lịch (complete)
    const handleCompleteBooking = async (booking) => {
        if (!booking) return;
        setActionLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const response = await apiFetch(`/api/coach/consultation/complete/${booking.bookingID}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Lỗi khi hoàn thành lịch!");
            toast.success(data.message || "Đánh dấu hoàn thành lịch thành công!");
            fetchBookings();
        } catch (error) {
            toast.error(error.message || "Lỗi khi hoàn thành lịch!");
        } finally {
            setActionLoading(false);
        }
    };

    // Tab "Đã xác nhận" → bấm "Gửi thông tin" để cập nhật meeting link, note, language
    const handleShowUpdateInfo = (booking) => {
        setSelectedBooking(booking);
        setSendInfoIsUpdate(true); // cập nhật info
        setShowSendInfoModal(true);
    };

    // Gửi/cập nhật info cho tab đã xác nhận
    const handleUpdateInfo = async (info) => {
        if (!selectedBooking) return;
        setInfoLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const response = await apiFetch(`/api/coach/consultation/update/${selectedBooking.bookingID}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(info)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Gửi thông tin thất bại!");
            toast.success(data.message || "Đã cập nhật thông tin cho thành viên!");
            setShowSendInfoModal(false);
            fetchBookings();
        } catch (error) {
            toast.error(error.message || "Gửi thông tin thất bại!");
        } finally {
            setInfoLoading(false);
        }
    };

    // Phân loại booking theo status
    const bookingsByStatus = {
        Pending: bookings.filter(b => b.status === "Pending"),
        Approved: bookings.filter(b => b.status === "Approved" || b.status === "Confirmed"),
        Completed: bookings.filter(b => b.status === "Completed"),
        Reject: bookings.filter(b => b.status === "Reject"),
        Cancelled: bookings.filter(b => b.status === "Cancelled"),
    };

    // Table render cho từng tab
    const renderTable = (bookingList, statusKey) => (
        <Table responsive bordered hover>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Thành viên</th>
                    <th>Ngày</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                {bookingList.length === 0 ? (
                    <tr><td colSpan={6} className="text-center text-muted">Không có lịch nào.</td></tr>
                ) : bookingList.map((b, idx) => (
                    <tr key={b.bookingID}>
                        <td>{idx + 1}</td>
                        <td>{b.userName}</td>
                        <td>{b.bookingDate ? b.bookingDate.slice(0, 10) : ""}</td>
                        <td>{b.notes}</td>
                        <td>
                            <span className={STATUS_MAP[b.status]?.className || "badge bg-secondary"}>
                                {STATUS_MAP[b.status]?.label || b.status}
                            </span>
                        </td>
                        <td>
                            {statusKey === "Pending" && (
                                <Button
                                    size="sm"
                                    variant="success"
                                    onClick={() => handleClickBooking(b)}
                                >Duyệt / Từ chối</Button>
                            )}
                            {statusKey === "Approved" && (
                                <>
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => handleCompleteBooking(b)}
                                        disabled={actionLoading}
                                        className="me-2"
                                    >Hoàn thành</Button>
                                    <Button
                                        size="sm"
                                        variant="info"
                                        onClick={() => handleShowUpdateInfo(b)}
                                        disabled={infoLoading}
                                    >Gửi/Cập nhật thông tin</Button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return (
        <Container style={{ marginTop: 40, marginBottom: 40 }}>
            <h2 className="fw-bold mb-4">Lịch tư vấn của bạn</h2>
            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Card>
                    <Card.Body>
                        <Tabs
                            id="coach-booking-status-tabs"
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
                            <Tab eventKey="Reject" title="Từ chối">
                                {renderTable(bookingsByStatus.Reject, "Reject")}
                            </Tab>
                            <Tab eventKey="Cancelled" title="Đã huỷ">
                                {renderTable(bookingsByStatus.Cancelled, "Cancelled")}
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            )}

            {/* Modal xác nhận duyệt lịch */}
            <BookingActionModal
                show={showBookingModal}
                onHide={() => setShowBookingModal(false)}
                booking={selectedBooking}
                onApprove={handleApproveBooking}
                onReject={handleRejectBooking}
                loading={actionLoading}
            />
            {/* Modal gửi/cập nhật thông tin */}
            <SendInfoModal
                show={showSendInfoModal}
                onHide={() => setShowSendInfoModal(false)}
                booking={selectedBooking}
                onSend={sendInfoIsUpdate ? handleUpdateInfo : handleApproveAndSendInfo}
                loading={infoLoading}
                isUpdate={sendInfoIsUpdate}
            />
        </Container>
    );
};

export default CoachBookings;   