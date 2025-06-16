import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';
//import './ManagementPackage.css';

// Số dòng hiển thị mỗi trang (có thể điều chỉnh thành 20)
const pageSize = 20;

const ManagementPackage = () => {
    // State chọn view hiện tại: 'packages' hoặc 'transactions'
    const [view, setView] = useState('packages');
    const [packages, setPackages] = useState([]);
    const [pkgPage, setPkgPage] = useState(1);
    const [transactions, setTransactions] = useState([]);
    const [txnPage, setTxnPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newPkg, setNewPkg] = useState({ name: '', price: '', duration: '', description: '' });

    useEffect(() => {
        // TODO: Gọi API lấy danh sách gói
        // axios.get('/api/packages').then(res => setPackages(res.data));
        // TODO: Gọi API lấy danh sách giao dịch
        // axios.get('/api/transactions').then(res => setTransactions(res.data));
    }, []);

    // Hàm phân trang: nhận mảng và số trang, trả về mảng con
    const paginate = (data, page) => {
        const start = (page - 1) * pageSize;
        return data.slice(start, start + pageSize);
    };

    // Tính tổng số trang
    const totalPkgPages = Math.ceil(packages.length / pageSize);
    const totalTxnPages = Math.ceil(transactions.length / pageSize);

    // Hàm mở/đóng modal
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    // Cập nhật state form
    const handlePkgChange = e => {
        const { name, value } = e.target;
        setNewPkg(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý submit form Thêm gói
    const handlePkgSubmit = e => {
        e.preventDefault();
        // TODO: Gửi dữ liệu newPkg lên API
        // axios.post('/api/packages', newPkg).then(res => {
        //   setPackages([res.data, ...packages]);
        //   handleClose();
        // });
    };

    // Hàm mở modal để chỉnh sửa gói
    const handleEditPkg = (pkg) => {
        setNewPkg(pkg);  // Đặt thông tin gói hiện tại vào form chỉnh sửa
        setShowModal(true); // Mở modal
    };

    // Hàm xóa gói
    const handleDeletePkg = async (pkgId) => {
        try {
            await axios.delete(`/api/packages/${pkgId}`); // Gọi API để xóa gói
            setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== pkgId)); // Cập nhật lại danh sách gói
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

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
                            <Button variant="outline-primary" className="rounded-pill px-4" onClick={handleShow}>
                                + Thêm gói
                            </Button>
                        </Col>
                    </Row>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th><th>Tên gói</th><th>Giá</th><th>Thời hạn</th>
                                <th>Mô tả</th><th>Trạng thái</th><th>Lượt đăng ký</th><th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>

                            {paginate(packages, pkgPage).map(pkg => (
                                <tr key={pkg.id}>
                                    <td>{pkg.id}</td><td>{pkg.name}</td><td>{pkg.price}</td><td>{pkg.duration}</td>
                                    <td>{pkg.description}</td><td>{pkg.status}</td><td>{pkg.signups}</td>
                                    <td>
                                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleDeletePkg(pkg)}>Sửa</Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDeletePkg(pkg.id)}>Xóa</Button>
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

            {/* Modal Thêm gói thành viên */}
            <Modal show={showModal} onHide={handleClose} centered size="md" dialogClassName="modal-rounded">
                <Modal.Header className="modal-header-custom" closeButton>
                    <Modal.Title className="modal-title-custom">Thêm gói thành viên</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handlePkgSubmit}>
                    <Modal.Body>
                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm="3" className="text-end fst-italic">Tên gói:</Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="name" value={newPkg.name} onChange={handlePkgChange} className="bg-light rounded-pill" placeholder="Nhập tên gói" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm="3" className="text-end fst-italic">Giá:</Form.Label>
                            <Col sm="9">
                                <Form.Control type="number" name="price" value={newPkg.price} onChange={handlePkgChange} className="bg-light rounded-pill" placeholder="Nhập giá" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm="3" className="text-end fst-italic">Thời hạn:</Form.Label>
                            <Col sm="9">
                                <Form.Control type="text" name="duration" value={newPkg.duration} onChange={handlePkgChange} className="bg-light rounded-pill" placeholder="Nhập thời hạn" required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="align-items-center mb-3">
                            <Form.Label column sm="3" className="text-end fst-italic">Mô tả:</Form.Label>
                            <Col sm="9">
                                <Form.Control as="textarea" name="description" value={newPkg.description} onChange={handlePkgChange} className="bg-light rounded-pill" placeholder="Nhập mô tả" rows={2} />
                            </Col>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer className="justify-content-end">
                        <Button variant="outline-secondary" className="rounded-pill px-4 me-2" onClick={handleClose}>Hủy</Button>
                        <Button variant="primary" className="rounded-pill px-4" type="submit">Lưu</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default ManagementPackage;
