import React, { useState, useEffect, useMemo } from 'react';
import { Container, Card, Spinner, Button, Badge, Modal } from 'react-bootstrap';
import apiFetch from '../../utils/apiFetch';



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
        const fetchMilestones = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('userToken');
                const res = await apiFetch('/api/user/milestones/list', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Không thể tải danh sách cột mốc');
                const progressList = await res.json();

                // Group milestones by groupId
                const groupMap = {};
                progressList.forEach(item => {
                    const groupId = item.milestoneGroupID ?? 0;
                    if (!groupMap[groupId]) {
                        groupMap[groupId] = {
                            groupId,
                            groupName: item.milestoneGroupName ?? "Nhóm khác",
                            milestones: [],
                        }
                    }
                    groupMap[groupId].milestones.push({
                        milestoneId: item.milestoneID,
                        name: item.milestoneName,
                        description: item.description,
                        timeToAchieve: `${item.milestoneTime ?? ''} ${item.timeUnit ?? ''}`.trim(),
                        progressPercent: item.achievedDate ? 100 : (item.percent ?? 0)
                    });
                });
                const milestoneGroups = Object.values(groupMap).sort((a, b) => a.groupId - b.groupId);
                const achievementsUnlocked = progressList.filter(x => x.achievedDate).length;

                const apiData = {
                    summary: {
                        timeSinceQuit: '', // Có thể lấy từ API khác hoặc bổ sung backend
                        cigarettesAvoided: 0,
                        moneySaved: 0,
                        achievementsUnlocked,
                    },
                    milestoneGroups
                };

                setData(apiData);
                if (milestoneGroups.length > 0)
                    setActiveFilter(milestoneGroups[0].groupId);
            } catch (err) {
                setData(null);
                alert(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMilestones();
    }, []);
    const filteredMilestones = useMemo(() => {
        if (!data || !activeFilter) return [];
        const activeGroup = data.milestoneGroups.find(group => group.groupId === activeFilter);
        return activeGroup ? activeGroup.milestones : [];
    }, [data, activeFilter]);


    if (isLoading) {
        return (
            <Container className="text-center  d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" variant="success" />
                <h4 className="ms-3">Đang tải các cột mốc...</h4>
            </Container>
        );
    }

    return (
        <>
            <Container>
                {/* --- Phần Nút Lọc --- */}
                <div className="text-center mb-4 pt-4 d-flex flex-wrap justify-content-center">
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
