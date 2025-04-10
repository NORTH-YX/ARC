import React from 'react';
import { Table, Tag } from 'antd';
import { Kpis } from '../../../../../../../modules/kpis/domain/types';

interface SprintPerformanceProps {
  kpis: Kpis | null;
}

const SprintPerformance: React.FC<SprintPerformanceProps> = ({ kpis }) => {
  const columns = [
    {
      title: 'Sprint',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Compliance Rate',
      dataIndex: 'tasa_cumplimiento',
      key: 'tasa_cumplimiento',
      render: (rate: number) => (
        <Tag color={rate >= 90 ? 'success' : rate >= 75 ? 'warning' : 'error'}>
          {rate}%
        </Tag>
      ),
    },
    {
      title: 'Tasks Completed',
      dataIndex: 'tareas_completadas',
      key: 'tareas_completadas',
    },
    {
      title: 'Tasks On Time',
      dataIndex: 'tareas_a_tiempo',
      key: 'tareas_a_tiempo',
    },
    {
      title: 'Avg. Deviation',
      key: 'deviation',
      render: (_: any, record: any) => (
        <span style={{ 
          color: record.desviacion_promedio_horas > 0 ? '#cf1322' : '#3f8600' 
        }}>
          {record.desviacion_promedio_horas ? record.desviacion_promedio_horas : 0}hrs
        </span>
      ),
    },
  ];

  // Create a map of estimation precision data by sprint ID
  const estimationMap = new Map(
    kpis?.estimation_precision?.sprints?.map(sprint => [sprint.id, sprint]) || []
  );

  // Merge compliance rate data with estimation precision data using sprint ID
  const sprintData = kpis?.compliance_rate?.sprints?.map(sprint => ({
    ...sprint,
    ...(estimationMap.get(sprint.id) || {}),
    key: sprint.id,
  })) || [];

  return (
    <div style={{ marginBottom: "40px" }}>
      <h2 style={{ marginBottom: "20px" }}>Sprint Performance</h2>
      <Table 
        columns={columns} 
        dataSource={sprintData}
        pagination={false}
      />
    </div>
  );
};

export default SprintPerformance; 