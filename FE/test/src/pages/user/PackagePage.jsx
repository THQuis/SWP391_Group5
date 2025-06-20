import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Giao diện MakePaymentModal đơn giản
function MakePaymentModal({ show, handleClose, selectedPackage }) {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (show) setLoading(false); // Reset loading mỗi lần mở modal/gói mới
    }, [show, selectedPackage]);

    const handlePaymentClick = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const userId = localStorage.getItem("userId");
            // Đặt console.log ở đây để xem giá trị gửi đi
            console.log({
                token,
                userId,
                packageId: selectedPackage.id,
                method: "momo"
            });
            const body = {
                userId: parseInt(userId),
                packageId: selectedPackage.id,
                method: "momo",
            };
            const res = await fetch("/api/membership/create-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error("API error:", errData);
                throw new Error((errData && errData.message) || "Tạo thanh toán thất bại");
            }
            const data = await res.json();
            window.location.href = data.payUrl;
        } catch (err) {
            alert(err.message || "Có lỗi khi tạo thanh toán");
            setLoading(false);
        }
    };
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
                                {selectedPackage?.price?.toLocaleString()}<sup>đ</sup>{" "}
                                {selectedPackage?.durationLabel}
                            </span>
                        </div>
                        <div className="mt-3">
                            <Button
                                variant="success"
                                className="w-100"
                                onClick={handlePaymentClick}
                                disabled={loading}
                            >
                                {loading ? "Đang chuyển hướng..." : "Thanh toán"}
                            </Button>
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


function getDurationLabel(pkg) {
    // Xây dựng label cho thời lượng
    if (pkg.price === 0) return "Miễn phí";
    if (pkg.duration === 1) return "/tháng";
    if (pkg.duration === 3) return "/3 tháng";
    if (pkg.duration === 12) return "/12 tháng";
    return `/${pkg.duration} tháng`;
}

function getBadge(pkg) {
    if (pkg.price === 0) {
        return (
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
        );
    }
    return (
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

    // Thêm các state dưới đây
    const [currentPackageId, setCurrentPackageId] = useState(null);
    const [currentPackagePrice, setCurrentPackagePrice] = useState(null);
    const navigate = useNavigate();
    // Đặt lại state khi đóng modal
    // const handleCloseModal = () => {
    //     setShowModal(false);
    //     setSelectedPackage(null);
    //     // reset thêm các state khác nếu cần
    // };

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem("userToken");
        fetch("/api/membership/packages", {
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "*/*",
            },
        })
            .then(res => res.json())
            .then(data => {
                const arr = (data.packages || []).map(pkg => ({
                    id: pkg.packageID,
                    name: pkg.packageName,
                    description: pkg.description,
                    price: pkg.price,
                    duration: pkg.duration,
                    durationLabel: getDurationLabel(pkg),
                    badge: getBadge(pkg),
                    features: pkg.description
                        ? pkg.description.split(",").map(s => s.trim())
                        : [],
                    highlight: pkg.price === 0,
                }));
                setListPackages(arr);

                // Cập nhật currentPackageId và currentPackagePrice
                setCurrentPackageId(data.currentPackageId);
                if (data.currentPackagePrice !== undefined) {
                    setCurrentPackagePrice(data.currentPackagePrice);
                } else {
                    const current = (data.packages || []).find(
                        p => p.packageID === data.currentPackageId
                    );
                    setCurrentPackagePrice(current ? current.price : 0);
                }
            })
            .catch(() => setListPackages([]))
            .finally(() => setLoading(false));
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
        <Container>
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
                                                    {pkg.durationLabel}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <ul className="mb-3" style={{ fontSize: 15, paddingLeft: 18 }}>
                                        {pkg.features.map((f, fidx) => (
                                            <li key={fidx} style={{ marginBottom: 2 }}>{f}</li>
                                        ))}
                                    </ul>
                                    {/* Xử lý logic nút chọn gói ở đây */}
                                    {pkg.price === 0 ? (
                                        <Button
                                            variant="success"
                                            className="px-4"
                                            size="md"
                                            style={{
                                                borderRadius: 20,
                                                fontWeight: 500,
                                                minWidth: 110,
                                            }}
                                            onClick={() => {
                                                // Nếu user đã có gói trả phí thì cảnh báo, ngược lại thì điều hướng
                                                if (
                                                    currentPackageId &&
                                                    currentPackageId !== pkg.id &&
                                                    currentPackagePrice > 0
                                                ) {
                                                    alert("Bạn đã đăng ký gói trả phí, không thể chuyển về gói miễn phí.");
                                                } else {
                                                    navigate('/User/progress'); // hoặc trang bạn muốn
                                                }
                                            }}
                                        >
                                            Tiếp tục sử dụng miễn phí
                                        </Button>
                                    ) : (
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
                                    )}
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
        </Container>
    );
}