import React, { useState, useEffect } from 'react';
import {
  LeftOutlined, RightOutlined, MoreOutlined,
  CheckOutlined, EditOutlined, PlusOutlined,
  SaveOutlined, ShareAltOutlined, CheckCircleFilled
} from '@ant-design/icons';
import { Dropdown, Menu, Button, Modal, message, Card, Tag, Input } from 'antd';
import '../../styles/QuitPlan.css';
import apiFetch from '../../utils/apiFetch';
const { TextArea } = Input;

// Sample data for all days
const generateSampleData = () => {
  const samplePlans = [
    {
      day: "Monday",
      plan: "Drink herbal tea instead of smoking",
      comment: "Felt much better after replacing cigarettes with tea",
      done: true
    },
    {
      day: "Tuesday",
      plan: "Go for a 30-minute walk when craving hits",
      comment: "Walking helped reduce cravings significantly",
      done: true
    },
    {
      day: "Wednesday",
      plan: "Use nicotine gum when needed",
      comment: "Used gum twice today",
      done: false
    },
    {
      day: "Thursday",
      plan: "Practice deep breathing exercises",
      comment: "",
      done: false
    },
    {
      day: "Friday",
      plan: "Call a friend when feeling urge",
      comment: "",
      done: false
    },
    {
      day: "Saturday",
      plan: "Keep hands busy with stress ball",
      comment: "",
      done: false
    },
    {
      day: "Sunday",
      plan: "Reward yourself with a healthy treat",
      comment: "",
      done: false
    }
  ];

  return samplePlans;
};

const generateMonthWeeks = (year, month) => {
  const weeks = [];
  const date = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const samplePlans = generateSampleData();

  let week = [];
  for (let day = 1; day <= lastDay; day++) {
    const current = new Date(year, month, day);
    const weekday = current.toLocaleDateString('en-US', { weekday: 'long' });

    // Find matching sample plan
    const samplePlan = samplePlans.find(p => p.day === weekday) || {};

    week.push({
      day: weekday,
      date: current.toLocaleDateString('en-GB'),
      plan: samplePlan.plan || '',
      hasPlan: !!samplePlan.plan,
      comment: samplePlan.comment || '',
      done: samplePlan.done || false,
    });

    if (current.getDay() === 0 || day === lastDay) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
};

const QuitPlan = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [modalData, setModalData] = useState(null);
  const [editPlanMode, setEditPlanMode] = useState(false);
  const [tempPlan, setTempPlan] = useState('');
  const [tempComment, setTempComment] = useState('');

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setWeeks(generateMonthWeeks(year, month));
    setSelectedWeek(0);
  }, [currentDate]);

  const handleMonthChange = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  const handleOpenDayPlan = (day, weekIndex, dayIndex) => {
    setModalData({ ...day, weekIndex, dayIndex });
    setTempPlan(day.plan);
    setTempComment(day.comment);
    setEditPlanMode(false);
  };

  const handleSavePlan = () => {
    const updatedWeeks = [...weeks];
    const { weekIndex, dayIndex } = modalData;

    updatedWeeks[weekIndex][dayIndex].plan = tempPlan;
    updatedWeeks[weekIndex][dayIndex].hasPlan = !!tempPlan.trim();
    updatedWeeks[weekIndex][dayIndex].comment = tempComment;

    setWeeks(updatedWeeks);
    message.success('Plan saved successfully!');
    setEditPlanMode(false);
  };

  const handleCompleteDay = () => {
    const updatedWeeks = [...weeks];
    const { weekIndex, dayIndex } = modalData;

    updatedWeeks[weekIndex][dayIndex].done = true;
    setWeeks(updatedWeeks);
    message.success('Day marked as completed!');
    setModalData(null);
  };

  const handleSharePlan = () => {
    message.info('Sharing feature coming soon!');
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const menu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => setEditPlanMode(true)}>
        Edit Plan
      </Menu.Item>
      <Menu.Item
        key="complete"
        icon={<CheckOutlined />}
        onClick={handleCompleteDay}
        disabled={!modalData?.hasPlan}
      >
        Mark Complete
      </Menu.Item>
      <Menu.Item key="share" icon={<ShareAltOutlined />} onClick={handleSharePlan}>
        Share
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="quit-plan-app">
      {/* Header */}
      <header className="app-header">
        <h1>Quit Smoking Tracker</h1>
        <p>Your journey to a healthier life</p>
      </header>

      {/* Month Navigation */}
      <div className="month-navigation">
        <Button
          type="text"
          icon={<LeftOutlined />}
          onClick={() => handleMonthChange(-1)}
          className="nav-button"
        />
        <h2>{monthYear}</h2>
        <Button
          type="text"
          icon={<RightOutlined />}
          onClick={() => handleMonthChange(1)}
          className="nav-button"
        />
      </div>

      {/* Week Selector */}
      <div className="week-selector">
        {weeks.map((week, idx) => (
          <div
            key={idx}
            className={`week-card ${selectedWeek === idx ? 'active' : ''}`}
            onClick={() => setSelectedWeek(idx)}
          >
            <span className="week-title">Week {idx + 1}</span>
            <span className="week-dates">
              {week[0].date.split('/').slice(0, 2).join('/')} - {week[week.length - 1].date.split('/').slice(0, 2).join('/')}
            </span>
          </div>
        ))}
      </div>

      {/* Week Details */}
      {weeks[selectedWeek] && (
        <div className="week-details">
          {/* Progress Summary */}
          <div className="progress-summary">
            <div className="progress-item">
              <span>Completion</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(weeks[selectedWeek].filter(d => d.done).length / weeks[selectedWeek].length * 100)}%` }}
                />
              </div>
              <span>{weeks[selectedWeek].filter(d => d.done).length}/{weeks[selectedWeek].length} days</span>
            </div>
          </div>

          {/* Days Grid */}
          <div className="days-grid">
            {weeks[selectedWeek].map((day, index) => (
              <Card
                key={index}
                className={`day-card ${day.hasPlan ? 'has-plan' : 'empty'} ${day.done ? 'completed' : ''}`}
                onClick={() => handleOpenDayPlan(day, selectedWeek, index)}
              >
                <div className="day-header">
                  <div>
                    <div className="day-name">{day.day.substring(0, 3)}</div>
                    <div className="day-date">{day.date.split('/')[0]}</div>
                  </div>
                  {day.done ? (
                    <CheckCircleFilled className="status-icon completed" />
                  ) : day.hasPlan ? (
                    <CheckOutlined className="status-icon planned" />
                  ) : (
                    <PlusOutlined className="status-icon empty" />
                  )}
                </div>
                <div className="day-content">
                  {day.hasPlan ? (
                    <>
                      <p className="plan-text">{day.plan}</p>
                      {day.comment && <p className="plan-comment">{day.comment}</p>}
                    </>
                  ) : (
                    <p className="empty-plan">+ Add your plan</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={!!modalData}
        onCancel={() => setModalData(null)}
        footer={null}
        className="plan-modal"
        title={
          <div className="modal-header">
            <div>
              <h3>{modalData?.day}</h3>
              <p>{modalData?.date}</p>
            </div>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </div>
        }
      >
        <div className="modal-content">
          {editPlanMode ? (
            <div className="edit-plan-mode">
              <div className="form-group">
                <label>Your Plan</label>
                <TextArea
                  value={tempPlan}
                  onChange={(e) => setTempPlan(e.target.value)}
                  placeholder="What will you do instead of smoking?"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <TextArea
                  value={tempComment}
                  onChange={(e) => setTempComment(e.target.value)}
                  placeholder="Any additional thoughts..."
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <Button onClick={() => setEditPlanMode(false)}>Cancel</Button>
                <Button type="primary" onClick={handleSavePlan}>Save Plan</Button>
              </div>
            </div>
          ) : (
            <div className="view-mode">
              <div className="plan-section">
                <h4>Plan</h4>
                <div className="plan-content">
                  {modalData?.plan || <span className="no-plan">No plan yet</span>}
                </div>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditPlanMode(true)}
                  className="edit-plan-button"
                >
                  Edit Plan
                </Button>
              </div>
              <div className="notes-section">
                <h4>Notes</h4>
                <TextArea
                  value={tempComment}
                  onChange={(e) => {
                    setTempComment(e.target.value);
                    // Auto-save comment
                    const updatedWeeks = [...weeks];
                    updatedWeeks[modalData.weekIndex][modalData.dayIndex].comment = e.target.value;
                    setWeeks(updatedWeeks);
                  }}
                  placeholder="Add your notes here..."
                  rows={3}
                />
              </div>
              {modalData?.hasPlan && !modalData?.done && (
                <div className="complete-section">
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleCompleteDay}
                    block
                  >
                    Mark Day as Completed
                  </Button>
                </div>
              )}
              {modalData?.done && (
                <Tag icon={<CheckOutlined />} color="success" className="completed-tag">
                  This day is completed!
                </Tag>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default QuitPlan;