import React from 'react';
import { Card, Row, Col } from 'antd';
import { Column, Pie } from '@ant-design/plots';
import { Kpis } from '../../../../../../../modules/kpis/domain/types';

interface TeamPerformanceProps {
  kpis: Kpis | null;
}

interface PieChartData {
  type: string;
  value: number;
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ kpis }) => {
  const complianceData = kpis?.compliance_rate?.users?.map(user => ({
    name: user.name,
    value: user.tasa_cumplimiento,
  })) || [];

  const taskDistributionData = kpis?.compliance_rate?.users?.map(user => ({
    type: user.name,
    value: user.tareas_completadas || 0,
  })) || [];

  const complianceConfig = {
    data: complianceData,
    xField: 'name',
    yField: 'value',
    label: {
      position: 'top',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      name: {
        alias: 'Team Member',
      },
      value: {
        alias: 'Compliance Rate (%)',
      },
    },
  };

  const total = taskDistributionData.reduce((sum, item) => sum + item.value, 0);

  const taskDistributionConfig = {
    data: taskDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      offset: 20,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
      formatter: (datum: any) => {
        if (!datum || typeof datum.value === 'undefined') return '';
        const percent = ((datum.value / total) * 100).toFixed(1);
        return `${datum.type}\n${datum.value} tasks (${percent}%)`;
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Team Performance</h2>
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Compliance Rate by Team Member">
            <Column {...complianceConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Task Distribution">
            <Pie {...taskDistributionConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeamPerformance; 