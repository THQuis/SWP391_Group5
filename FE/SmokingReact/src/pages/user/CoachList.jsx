import React, { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Avatar,
    Typography,
    Chip,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/CoachList.module.scss";

// Hàm lấy danh sách coach từ API
const fetchCoaches = async () => {
    try {
        const response = await fetch("/api/user/coach/list", {
            method: "GET",
            headers: {
                "Accept": "*/*",
            },
        });
        if (!response.ok) {
            throw new Error("Không thể tải danh sách coach");
        }
        const data = await response.json();
        // Chuẩn hoá lại dữ liệu cho tương thích UI cũ
        return data.map((coach) => ({
            UserID: coach.coachId,
            FullName: coach.fullName,
            Email: coach.email,
            PhoneNumber: coach.phone,
            ProfilePicture: coach.profilePicture || null,
            Status: "Active", // API không trả về status, bạn có thể sửa lại nếu cần
            Description: coach.description,
            Gender: coach.gender,
            DateOfBirth: coach.dateOfBirth,
        }));
    } catch (err) {
        throw err;
    }
};

const CoachList = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // TODO: Thay thế selectedCoachId bằng logic thật từ backend/user context nếu có
    const selectedCoachId = 1;

    useEffect(() => {
        const getCoaches = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchCoaches();
                setCoaches(data);
            } catch (err) {
                setError(err.message || "Lỗi khi tải danh sách coach.");
            } finally {
                setLoading(false);
            }
        };
        getCoaches();
    }, []);

    return (
        <Container className={styles.wrapper}>
            <Typography className={styles.title}>
                Danh sách Chuyên gia tư vấn
            </Typography>

            {loading ? (
                <Grid container justifyContent="center">
                    <CircularProgress color="primary" size={48} />
                </Grid>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : coaches.length === 0 ? (
                <Alert severity="info">Chưa có Chuyên gia tư vấn nào.</Alert>
            ) : (
                <Grid container spacing={4} className={styles.grid}>
                    {coaches.map((c) => (
                        <Grid item key={c.UserID} xs={12} sm={6} md={4}>
                            <Card className={styles.card}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar
                                                src={
                                                    c.ProfilePicture ||
                                                    "https://github.com/THQuis/SWP391_Group5/blob/main/image/user.png?raw=true"
                                                }
                                                alt={c.FullName}
                                                className={styles.avatar}
                                            />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography
                                                className={styles.name}
                                                onClick={() =>
                                                    navigate(`/User/coach/profile/${c.UserID}`)
                                                }
                                            >
                                                {c.FullName}
                                            </Typography>
                                            {c.UserID === selectedCoachId && (
                                                <Typography className={styles.selectedLabel}>
                                                    (Chuyên gia tư vấn của bạn)
                                                </Typography>
                                            )}
                                            <Typography className={styles.info}>
                                                Email: {c.Email}
                                            </Typography>
                                            <div className={styles.chipContainer}>
                                                <Chip
                                                    label={`SĐT: ${c.PhoneNumber || "Chưa có"}`}
                                                    size="small"
                                                    color="info"
                                                />
                                                {/* Nếu cần, hiển thị trạng thái hoạt động */}
                                                <Chip
                                                    label={
                                                        c.Status === "Active"
                                                            ? "Hoạt động"
                                                            : "Không hoạt động"
                                                    }
                                                    size="small"
                                                    color={
                                                        c.Status === "Active" ? "success" : "default"
                                                    }
                                                />
                                            </div>
                                            {/* Có thể hiện thêm mô tả nếu muốn */}
                                            {c.Description && (
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    className={styles.info}
                                                >
                                                    {c.Description}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <CardActions className={styles.actions}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        onClick={() =>
                                            navigate(`/User/coach/profile/${c.UserID}`)
                                        }
                                    >
                                        Xem chi tiết
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CoachList;