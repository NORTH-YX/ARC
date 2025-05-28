import React, { useState, useEffect } from "react";
import { Card, Badge, Typography, Avatar, Row, Col, Progress, Tooltip, Spin } from 'antd';
import { ClockCircleOutlined, UserOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { User } from "../../../../../../interfaces/user";
import TasksTable from "./components/tasksTable";
import useTaskStore from "../../../../../../modules/tasks/store/useTaskStore";
import { useKpiStore } from "../../../../../../modules/kpis/store/useKpiStore";
import { useKpisBook } from "../../../../../../modules/kpis/hooks/useKpisBook";
import { useTaskBook } from "../../../../../../modules/tasks/hooks/useTaskBook";
import SprintPerformance from "./components/SprintPerformance";
import AIManagerTips from "./components/AIManagerTips";
import { Task } from "../../../../../../interfaces/task";
import { useDashboardInitialization } from "../../../../../../hooks/useDashboardInitialization";

const { Title, Text } = Typography;

interface DashProps {
  user: User;
}

const Dashboard: React.FC<DashProps> = ({ user }) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  // Initialize both KPIs and Tasks data
  const { data: kpisData, isLoading: isKpisLoading, error: kpisError } = useKpisBook();
  const { data: tasksData, isLoading: isTasksLoading, error: tasksError } = useTaskBook();
  
  const kpiStore = useKpiStore();
  const taskStore = useTaskStore();

  // Use the combined initialization hook
  useDashboardInitialization(kpisData, tasksData, kpiStore, taskStore);

  // Combined loading and error states
  const isLoading = isKpisLoading || isTasksLoading;
  const hasError = kpisError || tasksError;

  // Get tasks data directly from taskBook
  const tasks = (taskStore.taskBook?.tasks || []) as Task[];
  const completedTasks = tasks.filter((t: Task) => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter((t: Task) => t.status === 'In Progress').length;
  const toStartTasks = tasks.filter((t: Task) => t.status === 'To Do').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate total hours worked
  const totalHoursWorked = tasks.reduce((acc, task) => acc + (task.realHours || 0), 0);
  
  // Calculate project averages from KPIs
  const projectStats = (() => {
    const projects = kpiStore.kpis?.compliance_rate?.projects || [];
    const estimationProjects = kpiStore.kpis?.estimation_precision?.projects || [];
    
    if (projects.length === 0) return {
      avgCompliance: 0,
      avgTasksCompleted: 0,
      avgTasksOnTime: 0,
      avgDeviation: {
        days: 0,
        hours: 0
      }
    };

    const totals = projects.reduce((acc, project) => ({
      compliance: acc.compliance + (project.tasa_cumplimiento || 0),
      tasksCompleted: acc.tasksCompleted + (project.tareas_completadas || 0),
      tasksOnTime: acc.tasksOnTime + (project.tareas_a_tiempo || 0)
    }), { compliance: 0, tasksCompleted: 0, tasksOnTime: 0 });

    const deviationTotals = estimationProjects.reduce((acc, project) => ({
      days: acc.days + (project.desviacion_promedio_dias || 0),
      hours: acc.hours + (project.desviacion_promedio_horas || 0)
    }), { days: 0, hours: 0 });

    return {
      avgCompliance: totals.compliance / projects.length,
      avgTasksCompleted: totals.tasksCompleted / projects.length,
      avgTasksOnTime: totals.tasksOnTime / projects.length,
      avgDeviation: {
        days: deviationTotals.days / estimationProjects.length,
        hours: deviationTotals.hours / estimationProjects.length
      }
    };
  })();

  // Calculate hours per day for the current week
  const calculateHoursPerDay = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

    const hoursPerDay: { [key: string]: number } = {
      'Mo': 0, 'Tu': 0, 'We': 0, 'Th': 0, 'Fr': 0, 'Sa': 0
    };

    tasks.forEach(task => {
      if (task.realHours && task.realFinishDate) {
        const finishDate = new Date(task.realFinishDate);
        if (finishDate >= startOfWeek) {
          const dayKey = finishDate.toLocaleString('en-US', { weekday: 'short' }).slice(0, 2);
          if (hoursPerDay[dayKey] !== undefined) {
            hoursPerDay[dayKey] += task.realHours;
          }
        }
      }
    });

    return Object.entries(hoursPerDay).map(([day, hours]) => ({
      day,
      hours: Number(hours.toFixed(1))
    }));
  };

  const hoursData = calculateHoursPerDay();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    return hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";
  };

  // Get overdue tasks (tasks with estimated finish date in the past)
  const getOverdueTasks = () => {
    if (!tasks || tasks.length === 0) return [];
    
    const now = new Date();
    return tasks.filter((task: Task) => {
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

  if (hasError) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3} type="danger">Error Loading Dashboard Data</Title>
        <Text type="secondary">
          {kpisError && 'Failed to load KPIs. '}
          {tasksError && 'Failed to load Tasks.'}
        </Text>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <Spin size="large" />
        <Text>Loading dashboard data...</Text>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%", padding: "32px" }}>
      {/* Header Section */}
      <Row justify="center" align="middle" style={{ marginBottom: "40px" }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Text type="secondary" style={{ fontSize: "16px", display: "block", marginBottom: "8px" }}>
            {formatDate(currentDateTime)}
          </Text>
          <Title level={2} style={{ margin: 0, fontSize: '32px', fontWeight: 600 }}>
            ERROR!
          </Title>
        </Col>
      </Row>

      {/* AI Manager Tips Section - Fix role check to work with Spring Security roles */}
      {user && (
        <AIManagerTips />
      )}

      {/* Metrics Overview Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card styles={{ body: { padding: "24px", height: "160px" } }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>Average Compliance Rate</Text>
            <Title level={2} style={{ margin: "12px 0", display: 'flex', alignItems: 'center' }}>
              {Math.round(projectStats.avgCompliance)}%
              <Tooltip title="Average compliance rate across all projects">
                <InfoCircleOutlined style={{ fontSize: '16px', marginLeft: '8px', color: '#8c8c8c' }} />
              </Tooltip>
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {Math.round(projectStats.avgTasksOnTime)} / {Math.round(projectStats.avgTasksCompleted)} tasks on time avg.
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card styles={{ body: { padding: "24px", height: "160px" } }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>Tasks Completed</Text>
            <Title level={2} style={{ margin: "12px 0" }}>{completedTasks}</Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>Total completed tasks</Text>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card styles={{ body: { padding: "24px", height: "160px" } }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>Average Time Deviation</Text>
            <Title level={2} style={{ margin: "12px 0", display: 'flex', alignItems: 'center' }}>
              {Math.abs(projectStats.avgDeviation.hours).toFixed(1)}h
              <Tooltip title={`Average deviation in days: ${Math.abs(projectStats.avgDeviation.days).toFixed(1)}`}>
                <InfoCircleOutlined style={{ fontSize: '16px', marginLeft: '8px', color: '#8c8c8c' }} />
              </Tooltip>
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {projectStats.avgDeviation.hours < 0 ? 'Ahead' : 'Behind'} of schedule
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Hours Spent & Task Progress Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={14}>
          <Card 
            styles={{ body: { padding: "24px", height: "400px" } }}
            title={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 0'
              }}>
                <div>
                  <Title level={4} style={{ margin: 0, fontSize: '18px' }}>Hours Spent</Title>
                  <Text type="secondary" style={{ fontSize: '14px' }}>This Week</Text>
                </div>
                <Title level={3} style={{ margin: 0, fontSize: '24px' }}>{totalHoursWorked}</Title>
              </div>
            }
          >
            <div style={{ height: "calc(100% - 60px)", paddingTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip />
                  <Bar dataKey="hours" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            styles={{ body: { padding: "24px", height: "400px" } }}
            title={
              <div style={{ padding: '8px 0' }}>
                <Title level={4} style={{ margin: 0, fontSize: '18px' }}>Task Progress</Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>This Week</Text>
              </div>
            }
          >
            <div style={{ 
              height: "calc(100% - 60px)",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: "20px 0"
            }}>
              <Progress
                type="circle"
                percent={completionRate}
                format={() => (
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{completedTasks}</div>
                    <div style={{ fontSize: '14px', color: '#8c8c8c' }}>OUT OF {totalTasks}</div>
                  </div>
                )}
                size={180}
                strokeWidth={8}
                strokeColor="#1890ff"
              />
              <Row justify="space-around" style={{ width: '100%', marginTop: '32px' }}>
                <Col>
                  <Badge color="#f5222d" text="In Progress" style={{ fontSize: '14px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginTop: '8px' }}>{inProgressTasks}</div>
                </Col>
                <Col>
                  <Badge color="#52c41a" text="Completed" style={{ fontSize: '14px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginTop: '8px' }}>{completedTasks}</div>
                </Col>
                <Col>
                  <Badge color="#1890ff" text="Yet to Start" style={{ fontSize: '14px' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginTop: '8px' }}>{toStartTasks}</div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

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

      {/* Projects Table Section - Now passing mutate function */}
      <TasksTable />

      {/* KPI Section - Simplified since we handle loading at the top level */}
      <SprintPerformance kpis={kpiStore.kpis} />
    </div>
  );
};

export default Dashboard;
