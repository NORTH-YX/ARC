import React, { useState, useEffect } from "react";
import { Card, Badge, Typography, Avatar } from 'antd';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import { User } from "../../../../../../interfaces/user";
import TasksTable from "./components/tasksTable";
import useTaskStore from "../../../../../../modules/tasks/store/useTaskStore";

const { Title, Text } = Typography;

interface DashProps {
  user: User;
}

const Dashboard: React.FC<DashProps> = ({ user }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { filteredTasks } = useTaskStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get overdue tasks (tasks with estimated finish date in the past)
  const getOverdueTasks = () => {
    if (!filteredTasks || filteredTasks.length === 0) return [];
    
    const now = new Date();
    return filteredTasks.filter(task => {
      if (!task.estimatedFinishDate) return false;
      const estimatedFinish = new Date(task.estimatedFinishDate);
      return estimatedFinish < now && (!task.realFinishDate || task.status !== 'Completed');
    });
  };

  const overdueTasks = getOverdueTasks();

  // Simple function to get priority color
  const getPriorityColor = (priority: number | string) => {
    const priorityNum = typeof priority === 'string' ? parseInt(priority) : priority;
    switch (priorityNum) {
      case 1: return '#52c41a'; // Low - Green
      case 2: return '#faad14'; // Medium - Yellow
      case 3: return '#f5222d'; // High - Red
      default: return '#1890ff'; // Default - Blue
    }
  };

  // Calculate days overdue
  const getDaysOverdue = (estimatedDate: string | null) => {
    if (!estimatedDate) return 0;
    
    const today = new Date();
    const estimated = new Date(estimatedDate);
    const diffTime = Math.abs(today.getTime() - estimated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date with null check
  const formatTaskDate = (dateString: string | null) => {
    if (!dateString) return "Not Set";
    
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ marginBottom: "5px" }}>Operations Overview</h1>
        <div style={{ 
          backgroundColor: "#f5f5f5", 
          padding: "8px 12px", 
          borderRadius: "6px",
          fontSize: "14px"
        }}>
          <span style={{ fontWeight: "600" }}>{formatDate(currentDateTime)}</span>
          <span style={{ margin: "0 5px" }}>|</span>
          <span>{formatTime(currentDateTime)}</span>
        </div>
      </div>
      <p style={{ color: "#6B7280", marginBottom: "20px" }}>
        Welcome back, {user?.name || 'User'}! Here's what's happening today.
      </p>

      {/* Overdue Tasks Section */}
      {overdueTasks.length > 0 && (
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <Title level={4} style={{ margin: 0 }}>Overdue Tasks</Title>
            <Badge count={overdueTasks.length} style={{ backgroundColor: '#f5222d' }} />
          </div>
          
          <div style={{ 
            display: "flex", 
            overflowX: "auto", 
            padding: "5px 0 15px 0",
            gap: "16px"
          }}>
            {overdueTasks.map(task => (
              <Card 
                key={task.taskId}
                hoverable
                style={{ 
                  width: 280, 
                  flex: "0 0 auto",
                  borderLeft: `4px solid ${getPriorityColor(task.priority)}`
                }}
              >
                <div style={{ marginBottom: "12px" }}>
                  <Text strong style={{ fontSize: "16px" }}>{task.taskName}</Text>
                  <div>
                    <Badge 
                      status={task.status === 'To Do' ? 'default' : 'processing'} 
                      text={task.status} 
                      style={{ marginTop: "4px" }}
                    />
                  </div>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  marginBottom: "12px", 
                  alignItems: "center" 
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ marginRight: "8px" }} />
                    <Text>{task.user?.name || 'Unassigned'}</Text>
                  </div>
                  <Badge 
                    count={`${task.sprint?.sprintName}`} 
                    style={{ backgroundColor: '#1890ff' }} 
                  />
                </div>
                
                <div style={{ color: "#f5222d", display: "flex", alignItems: "center" }}>
                  <ClockCircleOutlined style={{ marginRight: "8px" }} />
                  <Text strong type="danger">
                    {getDaysOverdue(task.estimatedFinishDate)} days overdue
                  </Text>
                </div>
                
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  marginTop: "12px", 
                  color: "#8c8c8c" 
                }}>
                  <CalendarOutlined style={{ marginRight: "8px" }} />
                  <Text type="secondary">
                    Due: {formatTaskDate(task.estimatedFinishDate)}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <TasksTable />
    </div>
  );
};

export default Dashboard;
