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

const COACHES = [
    {
        UserID: 1,
        FullName: "Nguyễn Văn A",
        Email: "nva@gmail.com",
        PhoneNumber: "0905556666",
        ProfilePicture:
            "https://github.com/THQuis/SWP391_Group5/blob/main/image/logo.png?raw=true",
        Status: "Active",
    },
    {
        UserID: 2,
        FullName: "Trần Thị Bình",
        Email: "binh@gmail.com",
        PhoneNumber: "0907778888",
        ProfilePicture: null,
        Status: "Inactive",
    },
    {
        UserID: 3,
        FullName: "Lê Thị B",
        Email: "ltb@gmail.com",
        PhoneNumber: "0909990000",
        ProfilePicture: null,
        Status: "Active",
    },
    {
        UserID: 4,
        FullName: "Trần Trung K",
        Email: "ttk@gmail.com",
        PhoneNumber: "0901234567",
        ProfilePicture: null,
        Status: "Active",
    },
];


const CoachList = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const selectedCoachId = 1; // Coach mà member đã chọn

    useEffect(() => {
        setTimeout(() => {
            setCoaches(COACHES);
            setLoading(false);
        }, 500);
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
                                                    "https://randomuser.me/api/portraits/lego/6.jpg"
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
                                                    label={`SĐT: ${c.PhoneNumber}`}
                                                    size="small"
                                                    color="info"
                                                />
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
