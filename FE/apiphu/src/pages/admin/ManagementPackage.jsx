import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Pagination, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
// Số dòng hiển thị mỗi trang (có thể điều chỉnh thành 20)
const pageSize = 20;

const ManagementPackage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('packages'); // 'packages', 'userMemberships', 'transactions'

    // State cho các gói
    const [packages, setPackages] = useState([]);
    const [pkgPage, setPkgPage] = useState(1);

    // THÊM MỚI: State cho danh sách thành viên sử dụng gói
    const [userMemberships, setUserMemberships] = useState([]);
    const [membershipPage, setMembershipPage] = useState(1);

    // State cho giao dịch
    const [transactions, setTransactions] = useState([]);
    const [txnPage, setTxnPage] = useState(1);

    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [currentPkg, setCurrentPkg] = useState({
        packageID: null, packageName: '', packageType: '', price: '', duration: '', description: ''
    });

    // ĐỔI TÊN: State cho Modal "Cấp gói"
    const [showAssignModal, setShowAssignModal] = useState(false);

    // ĐỔI TÊN: State cho form "Cấp gói"
    const [assignment, setAssignment] = useState({ userId: '', packageId: '' });
    // SỬA ĐỔI: Tải dữ liệu gói và dữ liệu của view hiện tại
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error("Vui lòng đăng nhập.");
            setIsLoading(false);
            return;
        }

        const fetchDataForView = async () => {
            setIsLoading(true);
            try {
                // CẢI TIỆN: Luôn tải danh sách các gói để dùng cho Modal "Cấp gói"
                const packagesResponse = await fetch('/api/admin/memberships/packages', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!packagesResponse.ok) throw new Error('Không tải được danh sách gói.');
                const packagesData = await packagesResponse.json();
                setPackages(packagesData);

                // Tải dữ liệu cho view hiện tại
                if (view === 'userMemberships') {
                    const usersResponse = await fetch('/api/admin/memberships/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!usersResponse.ok) throw new Error('Không tải được danh sách thành viên.');
                    const usersData = await usersResponse.json();
                    setUserMemberships(usersData);
                }
                // Thêm các view khác ở đây nếu cần
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataForView();
    }, [view]);

    // Hàm phân trang: nhận mảng và số trang, trả về mảng con
    const paginate = (data, page) => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    };

    // Tính toán số trang cho từng bảng
    const totalPkgPages = Math.ceil(packages.length / pageSize);
    const totalMembershipPages = Math.ceil(userMemberships.length / pageSize);
    const totalTxnPages = Math.ceil(transactions.length / pageSize);

    // ĐỔI TÊN: Hàm đóng/mở Modal "Cấp gói"
    const handleCloseAssignModal = () => {
        setShowAssignModal(false);
        setAssignment({ userId: '', packageId: '' }); // Reset form
    };
    const handleShowAssignModal = () => setShowAssignModal(true);

    // Cập nhật state form

    // Hàm cập nhật state cho form "Cấp gói"
    const handleAssignmentChange = e => {
        const { name, value } = e.target;
        setAssignment(prev => ({ ...prev, [name]: value }));
    };
    // THAY ĐỔI LỚN: Hàm xử lý submit form "Cấp gói"
    const handleAssignSubmit = async (e) => {
        e.preventDefault();
        if (!assignment.userId || !assignment.packageId) {
            toast.warn("Vui lòng nhập ID người dùng và chọn một gói.");
            return;
        }

        const token = localStorage.getItem('userToken');
        try {
            const response = await fetch('/api/admin/memberships/assign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: parseInt(assignment.userId),
                    packageId: parseInt(assignment.packageId)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Cấp gói thất bại.');
            }

            const result = await response.json();
            toast.success(result.message || "Cấp gói thành công!");
            handleCloseAssignModal();
            // Tải lại danh sách thành viên VIP để cập nhật
            if (view === 'userMemberships') {
                // Tự gọi lại hàm fetch để cập nhật bảng
                const usersResponse = await fetch('/api/admin/memberships/users', { headers: { 'Authorization': `Bearer ${token}` } });
                const usersData = await usersResponse.json();
                setUserMemberships(usersData);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    // Hàm mở modal để chỉnh sửa gói
    const handleEditPkg = (pkg) => {
        setCurrentPkg(pkg); // Đặt thông tin gói hiện tại vào form
        setShowModal(true); // Mở modal
    };
    // Hàm xóa gói
    const handleDeletePkg = async (pkgId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa gói có ID: ${pkgId}?`)) {
            // TODO: Thay thế URL API cho đúng
            toast.info(`Đang xóa gói ID: ${pkgId}...`);
            // await axios.delete(`/api/admin/memberships/packages/${pkgId}`);
            // setPackages(prev => prev.filter(p => p.packageID !== pkgId));
            // toast.success("Xóa gói thành công!");
        }
    };
    if (isLoading) {
        // SỬA ĐỔI: Màn hình tải hiển thị text động
        const loadingText = view === 'packages'
            ? "Đang tải danh sách gói..."
            : "Đang tải danh sách thành viên...";

        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">{loadingText}</h4>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-4">
            <h2 className="text-center text-success"> Quản lý gói thành viên  </h2>
            {/* Nút chuyển giữa hai bảng */}
            <Row className="mb-4">
                <Col className="d-flex justify-content-start gap-3"> {/* Căn trái và khoảng cách giữa các nút */}
                    <Button
                        variant={view === 'packages' ? 'primary' : 'outline-primary'}
                        onClick={() => setView('packages')}
                    >
                        Các gói thành viên
                    </Button>
                    <Button
                        variant={view === 'userMemberships' ? 'primary' : 'outline-primary'}
                        onClick={() => setView('userMemberships')}
                    >
                        Thành viên PREMIUM
                    </Button>
                    <Button
                        variant={view === 'transactions' ? 'primary' : 'outline-primary'}
                        onClick={() => setView('transactions')}
                    >
                        Các giao dịch thanh toán
                    </Button>
                </Col>
            </Row>

            {/* Bảng gói thành viên */}
            {view === 'packages' && (
                <>
                    <Row className="align-items-center mb-3">
                        <Col><h2>Các gói thành viên</h2></Col>
                        <Col className="text-end">
                            <Button variant="outline-primary" className="rounded-pill px-4" onClick={handleShowAssignModal}>
                                + Thêm gói
                            </Button>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                {/* SỬA ĐỔI: Cập nhật các cột cho khớp với API */}
                                <th>ID</th>
                                <th>Tên gói</th>
                                <th>Loại gói</th> {/* THÊM MỚI */}
                                <th>Giá (VND)</th>
                                <th>Thời hạn (Tháng)</th>
                                <th>Mô tả</th>
                                <th>Lượt đăng ký</th> {/* SỬA ĐỔI */}
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(packages, pkgPage).map(pkg => (
                                // SỬA ĐỔI: Key và các trường dữ liệu cho khớp API
                                <tr key={pkg.packageID}>
                                    <td>{pkg.packageID}</td>
                                    <td>{pkg.packageName}</td>
                                    <td>{pkg.packageType}</td> {/* THÊM MỚI */}
                                    <td>{pkg.price.toLocaleString('vi-VN')}</td>
                                    <td>{pkg.duration}</td>
                                    <td>{pkg.description}</td>
                                    <td>{pkg.userMemberships.length}</td> {/* SỬA ĐỔI */}
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPkg(pkg)}>Sửa</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: totalPkgPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={pkgPage === i + 1}
                                onClick={() => setPkgPage(i + 1)}
                            >{i + 1}</Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}

            {/* THÊM MỚI: Bảng hiển thị danh sách thành viên sử dụng gói */}
            {view === 'userMemberships' && (
                <>
                    <h2 className="mt-4">Thành viên đang sử dụng gói</h2>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID Đăng ký</th>
                                <th>Tên người dùng</th>
                                <th>Email</th>
                                <th>Tên gói</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái TT</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(userMemberships, membershipPage).map(item => (
                                <tr key={item.userMembershipID}>
                                    <td>{item.userMembershipID}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.packageName}</td>
                                    <td>{new Date(item.startDate).toLocaleDateString('vi-VN')}</td>
                                    <td>{new Date(item.endDate).toLocaleDateString('vi-VN')}</td>
                                    <td>
                                        <span className={`badge bg-${item.paymentStatus === 'Completed' ? 'success' : 'warning'}`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="info" size="sm">Xem chi tiết</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: totalMembershipPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={membershipPage === i + 1}
                                onClick={() => setMembershipPage(i + 1)}
                            >{i + 1}</Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}

            {/* Bảng giao dịch */}
            {view === 'transactions' && (
                <>
                    <h2 className="mt-5">Các giao dịch thanh toán</h2>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>STT</th><th>Người dùng</th><th>Gói đã mua</th>
                                <th>Số tiền</th><th>Thời gian</th><th>Trạng thái</th><th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(transactions, txnPage).map((txn, idx) => (
                                <tr key={txn.id || idx}>
                                    <td>{(txnPage - 1) * pageSize + idx + 1}</td>
                                    <td>{txn.userName}</td><td>{txn.packageName}</td>
                                    <td>{txn.amount}</td><td>{txn.time}</td><td>{txn.status}</td>
                                    <td>
                                        <Button variant="info" size="sm" className="me-2">Xem</Button>
                                        <Button variant="secondary" size="sm">Hoàn tiền</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: totalTxnPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={txnPage === i + 1}
                                onClick={() => setTxnPage(i + 1)}
                            >{i + 1}</Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}

            {/* THAY ĐỔI LỚN: Modal này giờ dùng để "Cấp gói" */}
            <Modal show={showAssignModal} onHide={handleCloseAssignModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cấp gói thành viên cho người dùng</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAssignSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Người dùng (UserID)</Form.Label>
                            <Form.Control
                                type="number"
                                name="userId"
                                value={assignment.userId}
                                onChange={handleAssignmentChange}
                                placeholder="Nhập ID của người dùng cần cấp gói"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chọn gói thành viên</Form.Label>
                            <Form.Select
                                name="packageId"
                                value={assignment.packageId}
                                onChange={handleAssignmentChange}
                                required
                            >
                                <option value="">-- Vui lòng chọn một gói --</option>
                                {packages.map(pkg => (
                                    <option key={pkg.packageID} value={pkg.packageID}>
                                        {pkg.packageName} ({pkg.price.toLocaleString('vi-VN')} VND)
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAssignModal}>Hủy</Button>
                        <Button variant="primary" type="submit">Xác nhận cấp gói</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default ManagementPackage;
