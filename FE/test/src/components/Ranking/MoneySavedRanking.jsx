import React, { useEffect, useState } from "react";
import {
    Table,
    Image,
    Spinner,
    Badge,
    ProgressBar,
    Pagination,
    Form,
    Button,
} from "react-bootstrap";
import { FaCrown, FaDollarSign } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRanking, useApi } from "../../hooks/useApi";
// import { toast } from "react-toastify"; // Uncomment if using toast notifications
import apiFetch from '../../utils/apiFetch';
function getCrown(idx) {
    if (idx === 0)
        return (
            <FaCrown
                style={{ color: "#FFD700", fontSize: 22, marginRight: 3 }}
                title="Hạng nhất"
            />
        );
    if (idx === 1)
        return (
            <FaCrown
                style={{ color: "#C0C0C0", fontSize: 20, marginRight: 3 }}
                title="Hạng nhì"
            />
        );
    if (idx === 2)
        return (
            <FaCrown
                style={{ color: "#cd7f32", fontSize: 18, marginRight: 3 }}
                title="Hạng ba"
            />
        );
    return null;
}

const USERS_PER_PAGE = 5;

function MoneySavedRanking() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    // Use the custom hook with localStorage integration
    const { rankingData: ranking, isLoading: loading, error, refetch } = useRanking('money-saved', 50);
    const { userData, isAuthenticated } = useApi();

    // Filter based on search - sử dụng fullName từ API response
    const filteredRanking = ranking.filter(u =>
        u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase())
    );

    const maxMoney = ranking.length > 0 && ranking[0].totalMoneySaved ? ranking[0].totalMoneySaved : 1;
    const totalPages = Math.ceil(filteredRanking.length / USERS_PER_PAGE);
    const currentPageData = filteredRanking.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

    useEffect(() => {
        setPage(1);
    }, [search]);

    // Show success message when data is loaded
    useEffect(() => {
        if (!loading && ranking.length > 0 && !error) {
            console.log(`✅ Đã tải ${ranking.length} người dùng từ API!`);
            // toast.success(`Đã tải ${ranking.length} người dùng từ API!`); // Uncomment if using toast
        }
    }, [loading, ranking.length, error]);

    // Check if user is authenticated before loading data
    useEffect(() => {
        if (!isAuthenticated()) {
            console.warn('User not authenticated, redirecting...');
            // Could redirect to login or show message
        }
    }, [isAuthenticated]);

    // Show error message if API fails
    if (error) {
        return (
            <div className="text-center my-5">
                <div className="alert alert-danger">
                    <h5>⚠️ Lỗi tải dữ liệu</h5>
                    <p>{error}</p>
                    <Button variant="primary" onClick={refetch}>
                        🔄 Thử lại
                    </Button>
                </div>
            </div>
        );
    }

    const handlePageChange = (number) => setPage(number);

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleExportExcel = () => {
        const data = filteredRanking.map((user, index) => ({
            "STT": index + 1,
            "Tên thành viên": user.fullName || "Unknown User",
            "Số tiền tiết kiệm": user.totalMoneySaved || 0,
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Tiền tiết kiệm");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
            new Blob([excelBuffer], { type: "application/octet-stream" }),
            "bang_xep_hang_tien_tiet_kiem.xlsx"
        );
    };

    return (
        <>
            {/* Debug info - User data from localStorage và API response */}
            {/* {userData && userData.userToken && (
                <div className="mb-3 p-2 bg-light rounded" style={{ fontSize: '12px' }}>
                    <div><strong>👤 User:</strong> {userData.userName} ({userData.userEmail})</div>
                    <div><strong>🔑 Token:</strong> {userData.userToken.substring(0, 30)}...</div>
                    <div><strong>📊 API Data:</strong> {ranking.length} users loaded</div>
                    {ranking.length > 0 && (
                        <div><strong>🎯 Sample:</strong> {JSON.stringify(ranking[0], null, 2).substring(0, 100)}...</div>
                    )}
                </div>
            )} */}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h4 className="mb-1">💰 Bảng xếp hạng theo tiền tiết kiệm</h4>
                    <p className="text-muted mb-0">Những người tiết kiệm nhiều nhất từ việc cai thuốc</p>
                    {/* <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2"
                        onClick={refetch}
                        disabled={loading}
                    >
                        🔄 Làm mới dữ liệu
                    </Button> */}
                </div>
                <div style={{ maxWidth: 300 }}>
                    <Form.Control
                        type="text"
                        placeholder="Tìm kiếm thành viên..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <>
                    <Table hover responsive style={{ background: "transparent" }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th className="text-center py-3" style={{ width: 80 }}>#</th>
                                <th className="py-3" style={{ minWidth: 200 }}>Thành viên</th>
                                <th className="text-center py-3" style={{ width: 180 }}>Số tiền tiết kiệm</th>
                                <th className="text-center py-3" style={{ width: 200 }}>Tiến trình</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPageData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center text-secondary py-5">
                                        {search ? "Không tìm thấy thành viên nào." : "Chưa có dữ liệu xếp hạng."}
                                    </td>
                                </tr>
                            ) : (
                                currentPageData.map((user, index) => {
                                    const realIdx = (page - 1) * USERS_PER_PAGE + index;
                                    return (
                                        <tr
                                            key={user.userID || index}
                                            style={realIdx === 0 ? { background: "#f0fff4" } : {}}
                                        >
                                            <td className="text-center fw-bold py-3" style={{ fontSize: 18 }}>
                                                {getCrown(realIdx)}
                                                {realIdx + 1}
                                            </td>
                                            <td className="py-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <Image
                                                        src={user.profilePicture || "https://via.placeholder.com/40"}
                                                        title={user.fullName || "Unknown User"}
                                                        roundedCircle
                                                        width={realIdx === 0 ? 50 : 40}
                                                        height={realIdx === 0 ? 50 : 40}
                                                        style={{
                                                            objectFit: "cover",
                                                            border: realIdx === 0 ? "3px solid #FFD700" : "2px solid #e9e9e9",
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="fw-semibold" style={{ fontSize: realIdx === 0 ? 18 : 16 }}>
                                                            {user.fullName || "Unknown User"}
                                                        </div>
                                                        {realIdx === 0 && (
                                                            <Badge bg="success" className="mt-1">
                                                                💰 Tiết kiệm nhất
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center py-3">
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <FaDollarSign color="#28a745" size={18} />
                                                    <span className="fw-bold" style={{ fontSize: 16, color: "#28a745" }}>
                                                        {formatMoney(user.totalMoneySaved || 0)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-center py-3">
                                                <ProgressBar
                                                    now={Math.min(100, ((user.totalMoneySaved || 0) / maxMoney) * 100)}
                                                    variant="success"
                                                    style={{ height: 8, minWidth: 120 }}
                                                />
                                                <small className="text-muted mt-1 d-block">
                                                    {(((user.totalMoneySaved || 0) / maxMoney) * 100).toFixed(1)}%
                                                </small>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center my-4">
                            <Pagination>
                                <Pagination.First
                                    onClick={() => handlePageChange(1)}
                                    disabled={page === 1}
                                />
                                <Pagination.Prev
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                />
                                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                                    const pageNum = Math.max(1, Math.min(page - 2 + idx, totalPages - 4 + idx));
                                    return (
                                        <Pagination.Item
                                            key={pageNum}
                                            active={page === pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Pagination.Item>
                                    );
                                })}
                                <Pagination.Next
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                />
                                <Pagination.Last
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={page === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                            Hiển thị {((page - 1) * USERS_PER_PAGE) + 1} - {Math.min(page * USERS_PER_PAGE, filteredRanking.length)}
                            trong tổng số {filteredRanking.length} thành viên
                        </div>
                        <Button variant="success" onClick={handleExportExcel} disabled={filteredRanking.length === 0}>
                            📊 Xuất Excel
                        </Button>
                    </div>
                </>
            )}
        </>
    );
}

export default MoneySavedRanking;
