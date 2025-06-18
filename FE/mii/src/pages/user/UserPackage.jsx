import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";

// Danh sách 4 gói dịch vụ
const DEMO_PACKAGE_LIST = [
    {
        id: 1,
        name: "Gói basic",
        price: 0,
        duration: "Miễn phí",
        badge: (
            <span
                style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#222",
                    border: "1.5px solid #222",
                    borderRadius: 4,
                    fontWeight: 700,
                    fontSize: 14,
                    padding: "1px 8px",
                    marginRight: 10,
                }}
            >
                FREE
            </span>
        ),
        features: [
            "Kế hoạch cơ bản",
            "Check list tiến trình",
            "Tham gia cộng đồng",
        ],
        highlight: true,
    },
    {
        id: 2,
        name: "Gói premium",
        price: 129000,
        duration: "/tháng",
        badge: (
            <span
                style={{
                    fontWeight: 700,
                    color: "#FFD700",
                    fontSize: 22,
                    marginRight: 10,
                }}
            >
                &#x1F451;
            </span>
        ),
        features: [
            "Đăng ký tư vấn trực tiếp với coach",
            "Huy hiệu premium",
            "Kế hoạch chi tiết",
            "Có tất cả tính năng basic",
        ],
        highlight: false,
    },
    {
        id: 3,
        name: "Gói premium",
        price: 299000,
        duration: "/3 tháng",
        badge: (
            <span
                style={{
                    fontWeight: 700,
                    color: "#FFD700",
                    fontSize: 22,
                    marginRight: 10,
                }}
            >
                &#x1F451;
            </span>
        ),
        features: [
            "Đăng ký tư vấn trực tiếp với coach",
            "Huy hiệu premium",
            "Kế hoạch chi tiết",
            "Có tất cả tính năng basic",
        ],
        highlight: false,
    },
    {
        id: 4,
        name: "Gói premium",
        price: 899000,
        duration: "/12 tháng",
        badge: (
            <span
                style={{
                    fontWeight: 700,
                    color: "#FFD700",
                    fontSize: 22,
                    marginRight: 10,
                }}
            >
                &#x1F451;
            </span>
        ),
        features: [
            "Đăng ký tư vấn trực tiếp với coach",
            "Huy hiệu premium",
            "Kế hoạch chi tiết",
            "Có tất cả tính năng basic",
        ],
        highlight: false,
    },
];

// Giao diện MakePaymentModal đơn giản
function MakePaymentModal({ show, handleClose, selectedPackage }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <b>Bạn đang chọn:</b> {selectedPackage?.name}
                </div>
                {selectedPackage?.price === 0 ? (
                    <div>Bạn đã chọn gói miễn phí, không cần thanh toán.</div>
                ) : (
                    <>
                        <div>
                            <b>Số tiền:</b>{" "}
                            <span style={{ color: "#1a7f37", fontWeight: 600 }}>
                                {selectedPackage?.price.toLocaleString()}<sup>đ</sup>{" "}
                                {selectedPackage?.duration}
                            </span>
                        </div>
                        <div className="mt-3">
                            {/* TODO: Thay thế phần này bằng form/thông tin thanh toán thực tế */}
                            <Button variant="success" className="w-100" disabled>
                                Thanh toán (Demo)
                            </Button>
                            <div className="text-muted mt-2" style={{ fontSize: 14 }}>
                                <i>* Tích hợp cổng thanh toán tại đây *</i>
                            </div>
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default function UserPackage({ onSelect }) {
    const [listPackages, setListPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Modal thanh toán
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setListPackages(DEMO_PACKAGE_LIST);
            setLoading(false);
        }, 700);
        // Nếu dùng API thực tế:
        // fetch("/api/packages")
        //   .then(res => res.json())
        //   .then(data => {
        //       setListPackages(data);
        //       setLoading(false);
        //   });
    }, []);

    const handleSelect = async (pkg) => {
        setSelecting(true);
        setSelectedId(pkg.id);
        setSelectedPackage(pkg);
        setShowModal(true);
        setSelecting(false);
        setSelectedId(null);

        // Nếu muốn gọi API thực tế khi chọn gói, gắn vào đây
        // if (onSelect) onSelect(pkg);
    };

    return (
        <Container style={{ marginTop: 40, marginBottom: 40 }}>
            <h2 className="fw-bold mb-4" style={{ fontSize: 22 }}>
                Chọn gói phí
            </h2>
            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Row className="justify-content-center" xs={1} sm={2} md={4} lg={4}>
                    {listPackages.map((pkg) => (
                        <Col
                            key={pkg.id}
                            className="mb-4 d-flex justify-content-center"
                            style={{ minWidth: 290, maxWidth: 340 }}
                        >
                            <Card
                                className="w-100"
                                style={{
                                    borderRadius: 28,
                                    border: pkg.highlight ? "3px solid #2EA3A3" : "none",
                                    boxShadow: "0 4px 24px #0002",
                                    background:
                                        "linear-gradient(90deg, #f8fafc 70%, #d1e7e5 100%)",
                                    minHeight: 270,
                                    maxWidth: 340,
                                }}
                            >
                                <Card.Body className="py-3 d-flex flex-column justify-content-between">
                                    <div className="d-flex align-items-center mb-1" style={{ minHeight: 34 }}>
                                        {pkg.badge}
                                        <span
                                            className="fw-bold"
                                            style={{
                                                color: pkg.price === 0 ? "#222" : "#B8860B",
                                                fontSize: 19,
                                                marginRight: 8,
                                            }}
                                        >
                                            {pkg.name}
                                        </span>
                                    </div>
                                    <div className="mb-1" style={{ fontSize: 16, fontWeight: 700 }}>
                                        {pkg.price === 0 ? (
                                            <span>Miễn phí</span>
                                        ) : (
                                            <>
                                                <span>{pkg.price.toLocaleString()}<sup>đ</sup></span>
                                                <span style={{ fontSize: 14, color: "#444", marginLeft: 6 }}>
                                                    {pkg.duration}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <ul className="mb-3" style={{ fontSize: 15, paddingLeft: 18 }}>
                                        {pkg.features.map((f, fidx) => (
                                            <li key={fidx} style={{ marginBottom: 2 }}>{f}</li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant="success"
                                        className="px-4"
                                        size="md"
                                        style={{
                                            borderRadius: 20,
                                            fontWeight: 500,
                                            minWidth: 110,
                                        }}
                                        onClick={() => handleSelect(pkg)}
                                        disabled={selecting && selectedId === pkg.id}
                                    >
                                        {selecting && selectedId === pkg.id ? "Đang chọn..." : "Chọn gói"}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <MakePaymentModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                selectedPackage={selectedPackage}
            />
            {/* 
        TODO: 
        - Nếu bạn lấy danh sách gói từ API, hãy fetch và set vào state thay cho DEMO_PACKAGE_LIST.
        - Gắn API thanh toán thực trong MakePaymentModal.
      */}
        </Container>
    );
}