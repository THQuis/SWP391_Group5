import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Spinner, Button, Badge, Modal } from 'react-bootstrap';

// --- GIẢ LẬP API RESPONSE ---
// Đã cập nhật một mô tả dài hơn để kiểm tra
const mockMilestoneData = {
    summary: {
        timeSinceQuit: "1 ngày 2 giờ",
        cigarettesAvoided: 8,
        moneySaved: 17600,
        achievementsUnlocked: 5,
    },
    milestoneGroups: [
        {
            groupId: 1,
            groupName: "Sức khỏe",
            milestones: [
                { milestoneId: 101, name: "Nhịp tim ổn định", description: "Huyết áp và nhịp tim của bạn bắt đầu trở lại mức bình thường, giảm gánh nặng cho tim.", timeToAchieve: "20 phút", progressPercent: 100 },
                { milestoneId: 102, name: "Mức Oxy tăng", description: "Nồng độ Carbon Monoxide (CO) trong máu giảm, cho phép oxy lưu thông tốt hơn.", timeToAchieve: "8 giờ", progressPercent: 15 },
                { milestoneId: 103, name: "Nguy cơ đau tim giảm", description: "Nguy cơ bị một cơn đau tim đột ngột đã giảm đi đáng kể. Đây là một trong những lợi ích sức khỏe quan trọng nhất và đến sớm nhất khi bạn ngừng hút thuốc. Carbon monoxide trong khói thuốc làm giảm lượng oxy trong máu, buộc tim phải làm việc vất vả hơn. Chỉ sau một ngày, mức oxy của bạn tăng lên và huyết áp bắt đầu giảm, làm giảm căng thẳng cho tim và các mạch máu. Điều này không chỉ giúp bạn cảm thấy khỏe mạnh hơn mà còn là một bước tiến lớn trong việc bảo vệ sức khỏe tim mạch lâu dài.", timeToAchieve: "24 giờ", progressPercent: 100 },
                { milestoneId: 104, name: "Vị giác và khứu giác cải thiện", description: "Các đầu dây thần kinh bắt đầu tái tạo, giúp bạn cảm nhận mùi vị tốt hơn.", timeToAchieve: "48 giờ", progressPercent: 54 },
            ]
        },
        {
            groupId: 2,
            groupName: "Thể trạng",
            milestones: [
                { milestoneId: 201, name: "Hô hấp dễ dàng hơn", description: "Các ống phế quản bắt đầu giãn ra, giúp việc hít thở trở nên thoải mái hơn.", timeToAchieve: "72 giờ", progressPercent: 36 },
                { milestoneId: 202, name: "Năng lượng tăng lên", description: "Lưu thông máu được cải thiện giúp bạn cảm thấy tràn đầy năng lượng hơn trong các hoạt động hàng ngày.", timeToAchieve: "2 tuần", progressPercent: 9 },
            ]
        },
        {
            groupId: 3,
            groupName: "Thành tựu",
            milestones: [
                { milestoneId: 301, name: "Vượt qua 24 giờ đầu tiên", description: "Bạn đã chiến thắng một trong những giai đoạn khó khăn nhất của việc cai thuốc.", timeToAchieve: "1 ngày", progressPercent: 100 },
            ]
        }
    ]
};


// Component Progress Circle để hiển thị %
const ProgressCircle = ({ percentage, size = '60px' }) => {
    const color = percentage === 100 ? '#4caf50' : '#2196f3';
    const background = `conic-gradient(${color} ${percentage}%, #e9ecef ${percentage}%)`;

    return (
        <div
            className="d-flex justify-content-center align-items-center rounded-circle"
            style={{
                width: size,
                height: size,
                background: background,
                flexShrink: 0
            }}
        >
            <div
                className="d-flex justify-content-center align-items-center rounded-circle"
                style={{
                    width: `calc(${size} - 10px)`,
                    height: `calc(${size} - 10px)`,
                    backgroundColor: 'white'
                }}
            >
                <span className="fw-bold" style={{ color: color }}>{percentage}%</span>
            </div>
        </div>
    );
};

// Component mới để xử lý mô tả dài
const MilestoneDescription = ({ text, isExpanded, onToggle }) => {
    const TRUNCATE_LENGTH = 120; // Số ký tự tối đa hiển thị
    const isLongText = text.length > TRUNCATE_LENGTH;

    if (!isLongText) {
        return <p className="text-muted mb-0 small">{text}</p>;
    }

    return (
        <div>
            <p className="text-muted mb-1 small" style={{ transition: 'all 0.3s ease' }}>
                {isExpanded ? text : `${text.substring(0, TRUNCATE_LENGTH)}...`}
            </p>
            <Button variant="link" size="sm" onClick={onToggle} className="p-0 text-decoration-none">
                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </Button>
        </div>
    );
};


const MilestonesPage = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(null);
    const [expandedId, setExpandedId] = useState(null); // State để theo dõi mục được mở rộng

    // State cho Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState(null);

    // Hàm xử lý cho Modal
    const handleShowModal = (milestone) => {
        setSelectedMilestone(milestone);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMilestone(null);
    };

    // Hàm xử lý cho việc mở rộng/thu gọn mô tả
    const handleToggleExpand = (milestoneId) => {
        setExpandedId(prevId => (prevId === milestoneId ? null : milestoneId));
    };

    useEffect(() => {
        // Giả lập gọi API
        setTimeout(() => {
            setData(mockMilestoneData);
            if (mockMilestoneData.milestoneGroups && mockMilestoneData.milestoneGroups.length > 0) {
                setActiveFilter(mockMilestoneData.milestoneGroups[0].groupId);
            }
            setIsLoading(false);
        }, 1000);
    }, []);

    const filteredMilestones = useMemo(() => {
        if (!data || !activeFilter) return [];
        const activeGroup = data.milestoneGroups.find(group => group.groupId === activeFilter);
        return activeGroup ? activeGroup.milestones : [];
    }, [data, activeFilter]);


    if (isLoading) {
        return (
            <Container className="text-center my-5 d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải các cột mốc...</h4>
            </Container>
        );
    }

    return (
        <>
            <Container className="my-5">
                {/* --- Phần Nút Lọc --- */}
                <div className="text-center mb-4 d-flex flex-wrap justify-content-center">
                    {data.milestoneGroups.map(group => (
                        <Button
                            key={group.groupId}
                            variant={activeFilter === group.groupId ? "success" : "outline-secondary"}
                            onClick={() => setActiveFilter(group.groupId)}
                            className="rounded-pill m-1"
                        >
                            {group.groupName}
                        </Button>
                    ))}
                </div>

                {/* --- Phần Danh sách Cột mốc --- */}
                <div>
                    {filteredMilestones.map(milestone => (
                        <Card
                            key={milestone.milestoneId}
                            className="mb-3 shadow-sm border-0"
                        >
                            <Card.Body
                                className="d-flex align-items-center p-3"
                                onClick={() => handleShowModal(milestone)}
                                style={{ cursor: 'pointer' }}
                            >
                                <ProgressCircle percentage={milestone.progressPercent} />
                                <div className="flex-grow-1 ms-3">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <h6 className="fw-bold mb-1">{milestone.name}</h6>
                                        <Badge pill bg="light" text="dark" className="ms-2">{milestone.timeToAchieve}</Badge>
                                    </div>
                                    <MilestoneDescription
                                        text={milestone.description}
                                        isExpanded={expandedId === milestone.milestoneId}
                                        onToggle={(e) => {
                                            e.stopPropagation(); // Ngăn modal mở ra khi nhấn nút "Xem thêm"
                                            handleToggleExpand(milestone.milestoneId);
                                        }}
                                    />
                                </div>
                            </Card.Body>
                            <div style={{ height: '4px', width: `${milestone.progressPercent}%`, backgroundColor: milestone.progressPercent === 100 ? '#4caf50' : '#2196f3' }}></div>
                        </Card>
                    ))}
                </div>
            </Container>

            {/* --- Modal hiển thị chi tiết --- */}
            <Modal show={showModal} onHide={handleCloseModal} centered scrollable>
                {selectedMilestone && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title className="fw-bold h5">{selectedMilestone.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-center p-4">
                            <ProgressCircle percentage={selectedMilestone.progressPercent} size="100px" />
                            <h5 className="mt-4 mb-2">{selectedMilestone.name}</h5>
                            <p className="text-muted px-3 text-start">
                                {selectedMilestone.description}
                            </p>
                            <Badge pill bg="success">
                                Hoàn thành sau: {selectedMilestone.timeToAchieve}
                            </Badge>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Đóng
                            </Button>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </>
    );
};

export default MilestonesPage;
