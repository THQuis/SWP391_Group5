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

    // State cho danh sách thành viên sử dụng gói
    const [userMemberships, setUserMemberships] = useState([]);
    const [membershipPage, setMembershipPage] = useState(1);

    // State cho giao dịch (chưa xử lý API, để trống)
    const [transactions, setTransactions] = useState([]);
    const [txnPage, setTxnPage] = useState(1);

    // State cho Modal gói (chưa dùng chỉnh sửa)
    const [showModal, setShowModal] = useState(false);
    const [currentPkg, setCurrentPkg] = useState({
        packageID: null, packageName: '', packageType: '', price: '', duration: '', description: ''
    });

    // Modal "Cấp gói"
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignment, setAssignment] = useState({ userId: '', packageId: '' });

    // Tải dữ liệu khi view thay đổi
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
                // Luôn tải danh sách các gói cho modal
                const packagesResponse = await fetch('/api/admin/memberships/packages', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!packagesResponse.ok) throw new Error('Không tải được danh sách gói.');
                const packagesData = await packagesResponse.json();
                setPackages(packagesData);

                if (view === 'userMemberships') {
                    const usersResponse = await fetch('/api/admin/memberships/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!usersResponse.ok) throw new Error('Không tải được danh sách thành viên.');
                    const usersData = await usersResponse.json();
                    setUserMemberships(usersData);
                }

                // Xử lý view giao dịch nếu cần ở đây
                // if (view === 'transactions') { ... }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataForView();
    }, [view]);

    // Phân trang
    const paginate = (data, page) => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    };

    // Tổng số trang
    const totalPkgPages = Math.ceil(packages.length / pageSize);
    const totalMembershipPages = Math.ceil(userMemberships.length / pageSize);
    const totalTxnPages = Math.ceil(transactions.length / pageSize);

    // Modal "Cấp gói"
    const handleCloseAssignModal = () => {
        setShowAssignModal(false);
        setAssignment({ userId: '', packageId: '' });
    };
    const handleShowAssignModal = () => setShowAssignModal(true);

    const handleAssignmentChange = e => {
        const { name, value } = e.target;
        setAssignment(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý API: Cấp gói cho user
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
            if (view === 'userMemberships') {
                // Reload lại danh sách thành viên
                const usersResponse = await fetch('/api/admin/memberships/users', { headers: { 'Authorization': `Bearer ${token}` } });
                const usersData = await usersResponse.json();
                setUserMemberships(usersData);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Xử lý API: Xóa gói
    const handleDeletePkg = async (pkgId) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa gói có ID: ${pkgId}?`)) return;
        const token = localStorage.getItem('userToken');
        toast.info(`Đang xóa gói ID: ${pkgId}...`);
        try {
            const response = await fetch(`/api/admin/memberships/packages/${pkgId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 404) {
                toast.error('Không tìm thấy gói.');
                return;
            }
            if (response.status === 400) {
                const data = await response.json();
                toast.error(data.message || 'Không thể xoá vì có người dùng đang sử dụng gói này.');
                return;
            }
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Xóa gói thất bại.');
            }
            const data = await response.json();
            toast.success(data.message || "Xóa gói thành công!");
            setPackages(prev => prev.filter(p => p.packageId !== pkgId && p.packageID !== pkgId));
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Hàm mở modal chỉnh sửa gói (chưa xử lý API)
    const handleEditPkg = (pkg) => {
        setCurrentPkg(pkg);
        setShowModal(true);
    };

    if (isLoading) {
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
            {/* Nút chuyển giữa các bảng */}
            <Row className="mb-4">
                <Col className="d-flex justify-content-start gap-3">
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
                                <th>ID</th>
                                <th>Tên gói</th>
                                <th>Thời hạn (tháng)</th>
                                <th>Giá (VND)</th>
                                <th>Số lượt mua</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginate(packages, pkgPage).map(pkg => (
                                <tr key={pkg.packageId || pkg.packageID}>
                                    <td>{pkg.packageId || pkg.packageID}</td>
                                    <td>{pkg.packageName}</td>
                                    <td>{pkg.duration}</td>
                                    <td>{pkg.price?.toLocaleString?.('vi-VN') || pkg.price}</td>
                                    <td>{pkg.purchasedCount ?? 0}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPkg(pkg)}>Sửa</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeletePkg(pkg.packageId || pkg.packageID)}>Xóa</Button>
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

            {/* Bảng thành viên */}
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
                                <tr key={item.userMembershipID || item.userMembershipId}>
                                    <td>{item.userMembershipID || item.userMembershipId}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.packageName}</td>
                                    <td>{item.startDate ? new Date(item.startDate).toLocaleDateString('vi-VN') : ''}</td>
                                    <td>{item.endDate ? new Date(item.endDate).toLocaleDateString('vi-VN') : ''}</td>
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

            {/* Modal "Cấp gói" */}
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
                                    <option key={pkg.packageId || pkg.packageID} value={pkg.packageId || pkg.packageID}>
                                        {pkg.packageName} ({pkg.price?.toLocaleString?.('vi-VN') || pkg.price} VND)
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