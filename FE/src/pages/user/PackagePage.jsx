import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import '../../styles/UserPackage.scss'; // Thêm file CSS riêng

// Component Modal Thanh toán được làm đẹp
function MakePaymentModal({ show, handleClose, selectedPackage }) {
    const [loading, setLoading] = useState(false);
    const [payUrl, setPayUrl] = useState(null);
    const [transactionReference, setTransactionReference] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [showIframe, setShowIframe] = useState(false);


    useEffect(() => {
        if (show) {
            setLoading(false);
            setPayUrl(null);
            setTransactionReference(null);
            setShowConfirm(false);
            setConfirming(false);
        }
    }, [show, selectedPackage]);

    const handlePaymentClick = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const userId = localStorage.getItem("userId");
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
                throw new Error(errData.message || "Tạo thanh toán thất bại");
            }
            const data = await res.json();
            setPayUrl(data.payUrl);
            setTransactionReference(data.reference);
            setShowIframe(true); // show iframe ngay
            setTimeout(() => {
                setShowIframe(false); // ẩn iframe sau 4s
                setShowConfirm(true); // show nút xác nhận
            }, 10000);

        } catch (err) {
            toast.error(err.message || "Có lỗi khi tạo thanh toán");
            setLoading(false);
        }
    };
    const handleConfirmPayment = async () => {
        if (!transactionReference) return;
        setConfirming(true);
        try {
            const token = localStorage.getItem("userToken");
            const res = await fetch("/api/membership/payment-callback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    transactionReference,
                    status: "Success",
                }),
            });

            if (!res.ok) throw new Error("Xác nhận thanh toán thất bại");
            toast.success("Thanh toán thành công!");
            handleClose();
            window.location.reload();
        } catch (err) {
            toast.error(err.message || "Lỗi khi xác nhận thanh toán");
            setConfirming(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="payment-modal">
            <Modal.Header closeButton>
                <Modal.Title className="gradient-text">Xác nhận thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body className="payment-modal-body">
                <div className="selected-package">
                    <div className="package-name">
                        <i className="fas fa-check-circle"></i>
                        <span>{selectedPackage?.name}</span>
                    </div>
                    {selectedPackage?.price === 0 ? (
                        <div className="free-package-notice">
                            Bạn đã chọn gói miễn phí, không cần thanh toán.
                        </div>
                    ) : !payUrl ? (
                        <div className="payment-button-container">
                            <Button
                                className="payment-button"
                                onClick={handlePaymentClick}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-lock mr-2"></i>
                                        Thanh toán an toàn
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <>
                            {showIframe && payUrl && (
                                <div className="momo-iframe-container mt-3 text-center">
                                    <iframe
                                        src={payUrl}
                                        title="Thanh toán MoMo"
                                        width="100%"
                                        height="600px"         // 👉 tăng chiều cao để hiển thị đủ nội dung ngang
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "12px",
                                            minWidth: "100%",
                                            aspectRatio: "16/9", // 👉 giữ tỷ lệ ngang như video hoặc web landscape
                                            overflow: "hidden"
                                        }}
                                    />
                                    <p className="text-muted mt-2">Đây là giao diện thanh toán MoMo giả lập</p>
                                </div>
                            )}


                            {showConfirm && (
                                <div className="payment-button-container mt-3">
                                    <Button
                                        className="payment-button"
                                        onClick={handleConfirmPayment}
                                        disabled={confirming}
                                    >
                                        {confirming ? (
                                            <>
                                                <Spinner size="sm" className="mr-2" />
                                                Đang xác nhận...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check-circle mr-2"></i>
                                                Xác nhận đã thanh toán
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}

function getDurationLabel(pkg) {
    // if (pkg.price === 0) return "Miễn phí";
    if (pkg.duration === 1) return "/tháng";
    if (pkg.duration === 3) return "/3 tháng";
    if (pkg.duration === 12) return "/năm";
    return `/${pkg.duration} tháng`;
}

function PackageCard({ pkg, onSelect, isSelected, isCurrentPackage }) {
    return (
        <Card className={`package-card ${pkg.highlight ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}>
            <div className="package-badge">
                {pkg.price === 0 ? (
                    <span className="free-badge">MIỄN PHÍ</span>
                ) : (
                    <span className="premium-badge">
                        <i className="fas fa-crown"></i>
                        PREMIUM
                    </span>
                )}
            </div>
            <Card.Body>
                <div className="package-header">
                    <h3 className="package-name">{pkg.name}</h3>
                    <div className="package-price">
                        {pkg.price === 0 ? (
                            <span className="free">Miễn phí</span>
                        ) : (
                            <>
                                <span className="amount">{pkg.price.toLocaleString()}</span>
                                <sup>đ</sup>
                                <span className="duration">{pkg.durationLabel}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="features-list">
                    {pkg.features.map((feature, index) => (
                        <div key={index} className="feature-item">
                            <i className="fas fa-check"></i>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
                <Button
                    className={`select-button ${pkg.price === 0 ? 'free-button' : 'premium-button'}`}
                    onClick={() => onSelect(pkg)}
                >
                    {pkg.price === 0 ? 'Bắt đầu miễn phí' : 'Nâng cấp ngay'}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default function UserPackage() {
    const [listPackages, setListPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [currentPackageId, setCurrentPackageId] = useState(null);
    const [currentPackagePrice, setCurrentPackagePrice] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("userToken");
                const res = await fetch("/api/membership/packages", {
                    headers: {
                        "Authorization": "Bearer " + token,
                        "Accept": "*/*",
                    },
                });
                const data = await res.json();

                const packages = (data.packages || []).map(pkg => ({
                    id: pkg.packageID,
                    name: pkg.packageName,
                    description: pkg.description,
                    price: pkg.price,
                    duration: pkg.duration,
                    durationLabel: getDurationLabel(pkg),
                    features: pkg.description ? pkg.description.split(",").map(s => s.trim()) : [],
                    highlight: pkg.price === 0,
                }));

                setListPackages(packages);
                setCurrentPackageId(data.currentPackageId);
                setCurrentPackagePrice(data.currentPackagePrice ?? 0);
            } catch (error) {
                toast.error("Không thể tải thông tin gói dịch vụ");
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const handleSelect = (pkg) => {
        if (pkg.price === 0) {
            if (currentPackageId && currentPackageId !== pkg.id && currentPackagePrice > 0) {
                toast.warning("Bạn đã đăng ký gói trả phí, không thể chuyển về gói miễn phí.");
                return;
            }
            navigate('/User/progress');
        } else {
            setSelectedPackage(pkg);
            setShowModal(true);
        }
    };

    return (
        <div className="user-package-container">
            <Container>
                <div className="page-header">
                    <h1 className="main-title">Chọn gói phù hợp với bạn</h1>
                    <p className="subtitle">Nâng cấp tài khoản để mở khóa thêm nhiều tính năng hấp dẫn</p>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <Spinner animation="border" variant="primary" />
                        <p>Đang tải thông tin...</p>
                    </div>
                ) : (
                    <Row className="package-grid">
                        {listPackages.map((pkg) => (
                            <Col key={pkg.id} xs={12} md={6} lg={3}>
                                <PackageCard
                                    pkg={pkg}
                                    onSelect={handleSelect}
                                    isSelected={selectedPackage?.id === pkg.id}
                                    isCurrentPackage={currentPackageId === pkg.id}
                                />
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
        </div>
    );
}