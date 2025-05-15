import React, { useState } from "react";
import { User } from "../../../../../../interfaces/user";
import { Typography, Row, Col, Card, Spin, Tabs, Tooltip } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { useKpiStore } from "../../../../../../modules/kpis/store/useKpiStore";
import { useKpisBook } from "../../../../../../modules/kpis/hooks/useKpisBook";
import { useTaskBook } from "../../../../../../modules/tasks/hooks/useTaskBook";
import { useDashboardInitialization } from "../../../../../../hooks/useDashboardInitialization";
import useTaskStore from "../../../../../../modules/tasks/store/useTaskStore";
import { Task } from "../../../../../../interfaces/task";
import ReportsSummary from "./components/ReportsSummary";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ReportsProps {
  user: User;
}

// Helper function to format data for charts
const prepareSprintHoursData = (tasks: Task[]) => {
  // Group tasks by sprint
  const sprintMap = new Map();
  
  tasks.forEach(task => {
    if (!task.sprint?.sprintName || !task.realHours) return;
    
    const sprintName = task.sprint.sprintName;
    if (!sprintMap.has(sprintName)) {
      sprintMap.set(sprintName, 0);
    }
    
    sprintMap.set(sprintName, sprintMap.get(sprintName) + (task.realHours || 0));
  });
  
  // Convert map to array for chart
  return Array.from(sprintMap.entries()).map(([sprint, hours]) => ({
    sprint,
    hours: Number(hours.toFixed(1))
  })).sort((a, b) => a.sprint.localeCompare(b.sprint));
};

// Helper function to prepare user sprint hours data
const prepareUserSprintHoursData = (tasks: Task[]) => {
  // Group tasks by sprint and user
  const sprintUserMap = new Map<string, Map<string, number>>();
  
  tasks.forEach(task => {
    if (!task.sprint?.sprintName || !task.realHours || !task.user?.name) return;
    
    const sprintName = task.sprint.sprintName;
    const userName = task.user.name;
    
    if (!sprintUserMap.has(sprintName)) {
      sprintUserMap.set(sprintName, new Map<string, number>());
    }
    
    const userMap = sprintUserMap.get(sprintName)!;
    if (!userMap.has(userName)) {
      userMap.set(userName, 0);
    }
    
    userMap.set(userName, userMap.get(userName)! + (task.realHours || 0));
  });
  
  // Convert nested maps to array for chart
  const result: Array<Record<string, any>> = [];
  const allUsers = new Set<string>();
  
  // First collect all users
  sprintUserMap.forEach((userMap) => {
    userMap.forEach((_, userName: string) => {
      allUsers.add(userName);
    });
  });
  
  // Then create data entries
  sprintUserMap.forEach((userMap, sprintName) => {
    const entry: Record<string, any> = { sprint: sprintName };
    
    allUsers.forEach(userName => {
      entry[userName] = Number((userMap.get(userName) || 0).toFixed(1));
    });
    
    result.push(entry);
  });
  
  return result.sort((a, b) => a.sprint.localeCompare(b.sprint));
};

// Helper function to prepare tasks completed data
const prepareTasksCompletedData = (tasks: Task[]) => {
  // Group completed tasks by sprint and user
  const sprintUserMap = new Map<string, Map<string, number>>();
  
  tasks.forEach(task => {
    if (!task.sprint?.sprintName || task.status !== 'Completed' || !task.user?.name) return;
    
    const sprintName = task.sprint.sprintName;
    const userName = task.user.name;
    
    if (!sprintUserMap.has(sprintName)) {
      sprintUserMap.set(sprintName, new Map<string, number>());
    }
    
    const userMap = sprintUserMap.get(sprintName)!;
    if (!userMap.has(userName)) {
      userMap.set(userName, 0);
    }
    
    userMap.set(userName, userMap.get(userName)! + 1);
  });
  
  // Convert nested maps to array for chart
  const result: Array<Record<string, any>> = [];
  const allUsers = new Set<string>();
  
  // First collect all users
  sprintUserMap.forEach((userMap) => {
    userMap.forEach((_, userName: string) => {
      allUsers.add(userName);
    });
  });
  
  // Then create data entries
  sprintUserMap.forEach((userMap, sprintName) => {
    const entry: Record<string, any> = { sprint: sprintName };
    
    allUsers.forEach(userName => {
      entry[userName] = userMap.get(userName) || 0;
    });
    
    result.push(entry);
  });
  
  return result.sort((a, b) => a.sprint.localeCompare(b.sprint));
};

// Helper function to get most recent sprint tasks
const getLatestSprintTasks = (tasks: Task[]) => {
  if (!tasks || tasks.length === 0) return [];
  
  // Find the most recent sprint
  let latestSprint: typeof tasks[0]['sprint'] | null = null;
  let latestSprintDate = new Date(0);
  
  tasks.forEach(task => {
    if (task.sprint?.creationDate) {
      const sprintStartDate = new Date(task.sprint.creationDate);
      if (sprintStartDate > latestSprintDate) {
        latestSprintDate = sprintStartDate;
        latestSprint = task.sprint;
      }
    }
  });
  
  if (!latestSprint) return [];
  
  // Get completed tasks from the latest sprint
  return tasks
    .filter(task => 
      task.status === 'Completed' && 
      task.sprint?.sprintId === latestSprint!.sprintId
    )
    .sort((a, b) => {
      // Sort by user name first
      const userA = a.user?.name || '';
      const userB = b.user?.name || '';
      if (userA !== userB) return userA.localeCompare(userB);
      
      // Then by completion date
      const dateA = a.realFinishDate ? new Date(a.realFinishDate).getTime() : 0;
      const dateB = b.realFinishDate ? new Date(b.realFinishDate).getTime() : 0;
      return dateB - dateA;
    });
};

// Bar color generator - updated with techy colors
const getBarColor = (index: number) => {
  const colors = [
    '#1890ff', '#52c41a', '#fa8c16', '#f5222d', '#722ed1', 
    '#eb2f96', '#13c2c2', '#faad14', '#2f54eb', '#a0d911'
  ];
  return colors[index % colors.length];
};

// Component for Hours Worked Per Sprint
const HoursPerSprintChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <Card 
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>Hours Worked Per Sprint</Title>
          <Text type="secondary">Analysis of time invested during project development</Text>
        </div>
      } 
      style={{ 
        marginBottom: "24px", 
        height: "400px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px"
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <defs>
            <linearGradient id="hoursTrend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#1890ff" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="sprint" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fill: '#8c8c8c' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis 
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#8c8c8c' }} 
            tick={{ fill: '#8c8c8c' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          <ChartTooltip 
            formatter={(value) => [`${value} hours`, 'Total Hours']}
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Line 
            type="monotone" 
            dataKey="hours" 
            stroke="#1890ff" 
            strokeWidth={3} 
            dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} 
            activeDot={{ r: 7, strokeWidth: 0 }} 
            name="Hours"
            animationDuration={1500}
            animationEasing="ease-in-out"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Component for Hours Worked Per Sprint Per User
const HoursPerUserPerSprintChart: React.FC<{ data: any[] }> = ({ data }) => {
  // Extract all user keys from the data (excluding 'sprint')
  const userKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'sprint') 
    : [];

  return (
    <Card 
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>Hours Worked Per User Per Sprint</Title>
          <Text type="secondary">Compare individual performance across sprints</Text>
        </div>
      } 
      style={{ 
        marginBottom: "24px", 
        height: "500px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px"
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          {userKeys.map((user, index) => (
            <defs key={`gradient-${user}`}>
              <linearGradient id={`userGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getBarColor(index)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getBarColor(index)} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
          ))}
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="sprint" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fill: '#8c8c8c' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis 
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#8c8c8c' }} 
            tick={{ fill: '#8c8c8c' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          <ChartTooltip
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }} 
            iconType="circle"
          />
          {userKeys.map((user, index) => (
            <Line 
              key={user} 
              type="monotone" 
              dataKey={user} 
              stroke={getBarColor(index)} 
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name={user}
              animationDuration={1000 + (index * 300)}
              animationEasing="ease-out"
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Component for Tasks Completed Per Sprint Per User
const TasksCompletedChart: React.FC<{ data: any[] }> = ({ data }) => {
  // Extract all user keys from the data (excluding 'sprint')
  const userKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'sprint') 
    : [];

  return (
    <Card 
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>Tasks Completed Per User Per Sprint</Title>
          <Text type="secondary">Compare task completion across team members</Text>
        </div>
      } 
      style={{ 
        marginBottom: "24px", 
        height: "500px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px"
      }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="sprint" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fill: '#8c8c8c' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis 
            label={{ value: 'Tasks', angle: -90, position: 'insideLeft', fill: '#8c8c8c' }} 
            tick={{ fill: '#8c8c8c' }}
            tickLine={{ stroke: '#f0f0f0' }}
          />
          <ChartTooltip
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }} 
            iconType="circle"
          />
          {userKeys.map((user, index) => (
            <Line 
              key={user} 
              type="monotone" 
              dataKey={user} 
              stroke={getBarColor(index)}
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name={user}
              animationDuration={1000 + (index * 300)}
              animationEasing="ease-out"
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Component for Latest Sprint Tasks Table
const LatestSprintTasksTable: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  // Group tasks by user
  const tasksByUser = new Map<string, Task[]>();
  
  tasks.forEach((task: Task) => {
    const userName = task.user?.name || 'Unassigned';
    if (!tasksByUser.has(userName)) {
      tasksByUser.set(userName, []);
    }
    tasksByUser.get(userName)!.push(task);
  });

  // Get sprint name from the first task (all tasks are from the same sprint)
  const sprintName = tasks.length > 0 ? tasks[0].sprint?.sprintName : 'N/A';

  return (
    <Card 
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>Latest Sprint Tasks Report: {sprintName}</Title>
          <Text type="secondary">Completed tasks in the most recent sprint by developer</Text>
        </div>
      } 
      style={{ 
        marginBottom: "24px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px"
      }}
      headStyle={{ 
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 24px'
      }}
      bodyStyle={{ 
        padding: '12px 24px 24px'
      }}
    >
      {Array.from(tasksByUser.entries()).map(([userName, userTasks]) => (
        <div key={userName} style={{ marginBottom: "24px" }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px 0', 
            borderBottom: "1px solid #f0f0f0", 
            marginBottom: '12px' 
          }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                background: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: '12px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {userName}
              </Title>
              <Text type="secondary">
                {userTasks.length} task{userTasks.length !== 1 ? 's' : ''} completed
              </Text>
            </div>
          </div>
          
          <div style={{ marginLeft: "16px" }}>
            {userTasks.map(task => (
              <div 
                key={task.taskId} 
                style={{ 
                  marginBottom: "16px", 
                  padding: "12px 16px", 
                  background: '#f9f9f9', 
                  borderRadius: '6px',
                  border: '1px solid #f0f0f0'
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '16px' }}>{task.taskName}</Text>
                  <div style={{ 
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: '#e6f7ff',
                    color: '#1890ff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {task.realHours ? `${task.realHours} hours` : 'No time logged'}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    Completed on: {task.realFinishDate 
                      ? new Date(task.realFinishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Unknown date'
                    }
                  </Text>
                </div>
                {task.description && (
                  <div style={{ marginTop: "8px", fontSize: "13px", color: '#666' }}>
                    <Text type="secondary" ellipsis={{ tooltip: true }}>{task.description}</Text>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
};

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('1');
  
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

  // Get tasks from store
  const tasks = (taskStore.taskBook?.tasks || []) as Task[];

  // Prepare chart data
  const hoursPerSprintData = prepareSprintHoursData(tasks);
  const userSprintHoursData = prepareUserSprintHoursData(tasks);
  const tasksCompletedData = prepareTasksCompletedData(tasks);
  const latestSprintTasks = getLatestSprintTasks(tasks);

  if (hasError) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3} type="danger">Error Loading Reports Data</Title>
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
        <Text>Loading reports data...</Text>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "32px",
        background: "#f9f9f9",
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: "32px" }}>
        <Col>
          <Title level={2} style={{ margin: 0, fontSize: "28px", fontWeight: 600 }}>Reports</Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            View and analyze project metrics and team performance for {user?.role === 'admin' ? 'all teams' : 'your team'}.
          </Text>
        </Col>
        <Col>
          <Tooltip title="These reports are generated based on completed tasks and logged hours. Ensure all team members log their hours accurately for precise reports.">
            <InfoCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          </Tooltip>
        </Col>
      </Row>

      {/* Summary Cards */}
      <ReportsSummary tasks={tasks} kpis={kpiStore.kpis} />

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        style={{ 
          marginBottom: "24px"
        }}
        tabBarStyle={{ 
          marginBottom: "24px", 
          borderBottom: "1px solid #f0f0f0"
        }}
        size="large"
      >
        <TabPane tab="Hours Analysis" key="1">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <HoursPerSprintChart data={hoursPerSprintData} />
            </Col>
            <Col span={24}>
              <HoursPerUserPerSprintChart data={userSprintHoursData} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Task Analysis" key="2">
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <TasksCompletedChart data={tasksCompletedData} />
            </Col>
            <Col span={24}>
              <LatestSprintTasksTable tasks={latestSprintTasks} />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Reports; 