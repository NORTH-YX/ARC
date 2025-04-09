import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, TeamOutlined, CheckOutlined } from '@ant-design/icons';
import { Kpis } from '../../../../../../../modules/kpis/domain/types';

interface KpiOverviewProps {
  kpis: Kpis | null;
}

const KpiOverview: React.FC<KpiOverviewProps> = ({ kpis }) => {
  const projectCompliance = kpis?.compliance_rate?.projects?.[0]?.tasa_cumplimiento || 0;
  const totalTasks = kpis?.compliance_rate?.projects?.[0]?.tareas_completadas || 0;
  const tasksOnTime = kpis?.compliance_rate?.projects?.[0]?.tareas_a_tiempo || 0;
  const avgDeviation = kpis?.estimation_precision?.projects?.[0]?.desviacion_promedio_horas || 0;

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Performance Metrics</h2>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Project Compliance"
              value={projectCompliance}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tasks Completed"
              value={totalTasks}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="On-Time Completion"
              value={tasksOnTime}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Time Deviation"
              value={avgDeviation}
              suffix="hrs"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: avgDeviation > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default KpiOverview; 