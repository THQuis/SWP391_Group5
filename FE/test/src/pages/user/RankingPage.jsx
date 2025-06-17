import React, { useEffect, useState } from "react";
import {
    Table,
    Container,
    Image,
    Card,
    Spinner,
    Row,
    Col,
    Badge,
    ProgressBar,
    Pagination,
    Form,
    Button,
} from "react-bootstrap";
import { FaCrown } from "react-icons/fa";
import { FaHandsClapping } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const FAKE_RANKING = [
    { userId: 1, name: "Nguyễn Văn An", clap: 17, avatar: "https://randomuser.me/api/portraits/men/11.jpg" },
    { userId: 2, name: "Lê Thị Trà Mi", clap: 15, avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    { userId: 3, name: "Trần Thị Bình", clap: 12, avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
    { userId: 4, name: "Trương Hoàng Quí", clap: 8, avatar: "https://randomuser.me/api/portraits/men/44.jpg" },
    { userId: 5, name: "Nguyễn Hữu Hùng", clap: 7, avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
    { userId: 6, name: "Hoàng Lan", clap: 6, avatar: "https://randomuser.me/api/portraits/women/66.jpg" },
    { userId: 7, name: "Bùi Minh Hiếu", clap: 5, avatar: "https://randomuser.me/api/portraits/men/77.jpg" },
    { userId: 8, name: "Lâm Mỹ Dung", clap: 4, avatar: "https://randomuser.me/api/portraits/women/88.jpg" },
    { userId: 9, name: "Đặng Quốc Việt", clap: 3, avatar: "https://randomuser.me/api/portraits/men/99.jpg" },
    { userId: 10, name: "Phạm Hồng Sơn", clap: 1, avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
];

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

function UserRanking() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setRanking(FAKE_RANKING);
            setLoading(false);
        }, 800);
    }, []);

    // Always sort original ranking (descending by clap)
    const sortedRanking = [...ranking].sort((a, b) => b.clap - a.clap);

    // Filter based on search (on the sorted ranking)
    const filteredRanking = sortedRanking.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const maxClap = sortedRanking.length > 0 ? sortedRanking[0].clap : 1;
    const totalPages = Math.ceil(filteredRanking.length / USERS_PER_PAGE);
    const currentPageData = filteredRanking.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const handlePageChange = (number) => setPage(number);

    const handleExportExcel = () => {
        const data = filteredRanking.map((user) => {
            // Find true index in sortedRanking
            const realIdx = sortedRanking.findIndex(u => u.userId === user.userId);
            return {
                "STT": realIdx + 1,
                "Tên thành viên": user.name,
                "Số Clap": user.clap,
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ranking");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(
            new Blob([excelBuffer], { type: "application/octet-stream" }),
            "bang_xep_hang.xlsx"
        );
    };

    return (
        <Container style={{ maxWidth: 900, marginTop: 40, marginBottom: 40 }}>
            <Row className="mb-3">
                <Col>
                    <h2 className="text-center fw-bold" style={{ letterSpacing: 1 }}>
                        BẢNG XẾP HẠNG
                    </h2>
                    <div
                        className="text-center text-secondary mb-3"
                        style={{ fontSize: 18 }}
                    >
                        <span role="img" aria-label="star">
                            ✨
                        </span>{" "}
                        Cùng thi đua để đạt nhiều clap nhất nhé!
                    </div>
                </Col>
            </Row>
            <Card style={{ borderRadius: 16, boxShadow: "0 4px 24px #0001" }}>
                <Card.Body
                    style={{
                        background: "linear-gradient(90deg, #f9fafb 70%, #e3f6fc 100%)",
                    }}
                >
                    <div className="mb-3" style={{ maxWidth: 320 }}>
                        <Form.Control
                            type="text"
                            placeholder="Tìm kiếm thành viên..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {loading ? (
                        <div className="text-center my-3">
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <>
                            <Table hover responsive style={{ background: "transparent" }}>
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ width: 60 }}>#</th>
                                        <th style={{ minWidth: 180 }}>Thành viên</th>
                                        <th className="text-center" style={{ width: 130 }}>Clap</th>
                                        <th className="text-center" style={{ width: 160 }}>Tiến trình</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPageData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-secondary">
                                                Không tìm thấy thành viên nào.
                                            </td>
                                        </tr>
                                    ) : (
                                        currentPageData.map((user) => {
                                            // Find true index in sortedRanking (not filteredRanking)
                                            const realIdx = sortedRanking.findIndex(u => u.userId === user.userId);
                                            return (
                                                <tr
                                                    key={user.userId}
                                                    style={realIdx === 0 ? { background: "#fffbe7" } : {}}
                                                >
                                                    <td className="text-center fw-bold" style={{ fontSize: 18 }}>
                                                        {getCrown(realIdx)}
                                                        {realIdx + 1}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <Image
                                                                src={user.avatar}
                                                                title={user.name}
                                                                roundedCircle
                                                                width={realIdx === 0 ? 54 : 40}
                                                                height={realIdx === 0 ? 54 : 40}
                                                                style={{
                                                                    objectFit: "cover",
                                                                    border: realIdx === 0 ? "3px solid #FFD700" : "2px solid #e9e9e9",
                                                                    transition: "all 0.2s"
                                                                }}
                                                            />
                                                            <span className="fw-semibold" style={{ fontSize: realIdx === 0 ? 20 : 16 }}>{user.name}</span>
                                                            {realIdx === 0 && (
                                                                <Badge bg="warning" text="dark" style={{ marginLeft: 8, fontSize: 13 }}>
                                                                    Top 1
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-center" style={{ fontWeight: 700, fontSize: 20 }}>
                                                        {user.clap} <FaHandsClapping color="#f7b801" size={22} title="Clap" />
                                                    </td>
                                                    <td className="text-center">
                                                        <ProgressBar
                                                            now={100 * user.clap / maxClap}
                                                            label={`${user.clap}`}
                                                            style={{ minWidth: 80 }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </Table>
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center">
                                    <Pagination>
                                        <Pagination.First
                                            onClick={() => handlePageChange(1)}
                                            disabled={page === 1}
                                        />
                                        <Pagination.Prev
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                        />
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <Pagination.Item
                                                key={idx + 1}
                                                active={page === idx + 1}
                                                onClick={() => handlePageChange(idx + 1)}
                                            >
                                                {idx + 1}
                                            </Pagination.Item>
                                        ))}
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

                            <div className="mt-4 d-flex justify-content-end">
                                <Button variant="success" onClick={handleExportExcel}>
                                    Xuất Excel
                                </Button>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>
            <div className="mt-4 text-center text-secondary" style={{ fontSize: 15 }}>
                Đặt mục tiêu hôm nay: <b>Hoàn thành milestone mới để tăng hạng nhé!</b>
            </div>
        </Container>
    );
}

export default UserRanking;