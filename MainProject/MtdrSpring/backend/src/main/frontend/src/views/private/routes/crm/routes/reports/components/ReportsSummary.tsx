import React from 'react';
import { Row, Col, Card, Typography, Tooltip } from 'antd';
import { InfoCircleOutlined, ClockCircleOutlined, CheckCircleOutlined, BarChartOutlined } from '@ant-design/icons';
import { Task } from '../../../../../../../interfaces/task';
import { Kpis } from '../../../../../../../modules/kpis/domain/types';

const { Title, Text } = Typography;

interface ReportsSummaryProps {
  tasks: Task[];
  kpis: Kpis | null;
}

const ReportsSummary: React.FC<ReportsSummaryProps> = ({ tasks, kpis }) => {
  // Calculate total hours worked
  const totalHoursWorked = tasks.reduce((acc, task) => acc + (task.realHours || 0), 0);
  
  // Calculate tasks statistics
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Calculate average hours per task
  const avgHoursPerTask = completedTasks > 0 
    ? Number((totalHoursWorked / completedTasks).toFixed(1)) 
    : 0;
  
  // Get average compliance rate from KPIs
  const avgComplianceRate = (() => {
    if (!kpis?.compliance_rate?.projects) return 0;
    
    const projects = kpis.compliance_rate.projects;
    if (projects.length === 0) return 0;
    
    const total = projects.reduce((acc, project) => acc + (project.tasa_cumplimiento || 0), 0);
    return Math.round(total / projects.length);
  })();
  
  // Get average time estimation precision
  const avgEstimationPrecision = (() => {
    if (!kpis?.estimation_precision?.projects) return 0;
    
    const projects = kpis.estimation_precision.projects;
    if (projects.length === 0) return 0;
    
    // Calculate precision based on deviation in hours
    const total = projects.reduce((acc, project) => {
      // Since there's no direct precision field, we'll use the deviation
      // to calculate a rough precision percentage (lower deviation = higher precision)
      const deviationHours = project.desviacion_promedio_horas || 0;
      const estimatedHours = 8; // Assuming 8 hours as a baseline for calculation
      
      // Calculate precision: 100% - (deviation/estimated * 100)
      // Cap at 0 to avoid negative values for large deviations
      const precision = Math.max(0, 100 - Math.abs(deviationHours / estimatedHours * 100));
      
      return acc + precision;
    }, 0);
    
    return Math.round(total / projects.length);
  })();
  
  const cardStyle = {
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    borderRadius: "8px",
    overflow: "hidden",
    height: "100%"
  };
  
  const iconStyle = {
    fontSize: '24px',
    marginBottom: '16px'
  };
  
  return (
    <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <ClockCircleOutlined style={{ ...iconStyle, color: '#1890ff' }} />
            <Title level={4} style={{ margin: "0 0 4px", color: '#8c8c8c' }}>Total Hours Worked</Title>
            <Title level={1} style={{ margin: "0 0 8px", fontSize: "48px", color: '#1890ff' }}>{totalHoursWorked}</Title>
            <Text type="secondary" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Avg: {avgHoursPerTask} hours/task
              <Tooltip title="Average hours spent per completed task">
                <InfoCircleOutlined style={{ marginLeft: "8px" }} />
              </Tooltip>
            </Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <CheckCircleOutlined style={{ ...iconStyle, color: '#52c41a' }} />
            <Title level={4} style={{ margin: "0 0 4px", color: '#8c8c8c' }}>Tasks Completed</Title>
            <Title level={1} style={{ margin: "0 0 8px", fontSize: "48px", color: '#52c41a' }}>{completedTasks}</Title>
            <Text type="secondary" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {completionRate}% completion rate
              <Tooltip title="Percentage of all tasks that have been completed">
                <InfoCircleOutlined style={{ marginLeft: "8px" }} />
              </Tooltip>
            </Text>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card style={cardStyle}>
          <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
            <BarChartOutlined style={{ ...iconStyle, color: '#722ed1' }} />
            <Title level={4} style={{ margin: "0 0 4px", color: '#8c8c8c' }}>Average Compliance Rate</Title>
            <Title level={1} style={{ margin: "0 0 8px", fontSize: "48px", color: '#722ed1' }}>{avgComplianceRate}%</Title>
            <Text type="secondary" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Estimation precision: {avgEstimationPrecision}%
              <Tooltip title="How accurately time estimates matched the actual work time">
                <InfoCircleOutlined style={{ marginLeft: "8px" }} />
              </Tooltip>
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ReportsSummary; 