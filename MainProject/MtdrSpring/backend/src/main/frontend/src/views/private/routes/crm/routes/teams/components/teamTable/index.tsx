import { Progress, Tooltip, Avatar } from "antd";
import { StyledTable, StyledSegmented } from "./elements";
import { User } from "../../../../../../../../interfaces/user";
import { KpiUser } from "../../../../../../../../modules/kpis/domain/types";
import { RiseOutlined, FallOutlined, SwapRightOutlined } from "@ant-design/icons";
import { getInitials, getRandomAvatarColor } from "../../../utils";

// Color helpers
const getColorByPercent = (percent: number): string => {
  if (percent < 40) return '#ff4d4f'; // Red
  if (percent < 80) return '#faad14'; // Orange
  return '#52c41a'; // Green
};

const getColorByDeviation = (deviation: number): string => {
  if (deviation > 1) return '#ff4d4f';
  if (deviation < 0) return '#52c41a';
  return '#faad14';
};

const getIconByDeviation = (deviation: number): any => {
  if (deviation > 1) return <FallOutlined style={{ fontSize: '20px' }} />;
  if (deviation < 0) return <RiseOutlined style={{ fontSize: '20px' }} />;
  return <SwapRightOutlined style={{ fontSize: '20px' }} />;
};

// Interface
interface TeamTableProps {
  teamMembers?: User[];
  complianceRate?: KpiUser[];
  estimationPrecision?: KpiUser[];
}

// Ranking logic
const assignRanks = (members: any[]): any[] => {
  const scored = members.map(member => {
    const compliance = member.compliance ?? 0;
    const tasks = member.tasksCompleted ?? 0;
    const deviation = member.hoursDeviation ?? 0;

    const score = (compliance * 1000) + (tasks * 10) - deviation;

    return {
      ...member,
      _score: score,
    };
  });

  return scored
    .sort((a, b) => b._score - a._score)
    .map((member, index) => ({
      ...member,
      rank: index + 1,
    }));
};

// Component
export const TeamTable: React.FC<TeamTableProps> = ({ teamMembers, complianceRate, estimationPrecision }) => {
  const mergedData = teamMembers?.map((member) => {
    const complianceEntry = complianceRate?.find(kpi => kpi.id === member.userId);
    const estimationEntry = estimationPrecision?.find(kpi => kpi.id === member.userId);

    return {
      ...member,
      hoursWorked: 40, // placeholder or real data
      tasksCompleted: complianceEntry?.tareas_completadas ?? 0,
      hoursDeviation: estimationEntry?.desviacion_promedio_horas ?? 0,
      compliance: complianceEntry?.tasa_cumplimiento ?? 0,
    };
  }) ?? [];

  const rankedData = assignRanks(mergedData);

  return (
    <StyledTable
      dataSource={rankedData}
      title={() => (
        <div>
          <StyledSegmented options={['This Week', 'This Month', 'All Time']} />
        </div>
      )}
      scroll={{ x: "max-content", y: "max-content" }}
    >
      <StyledTable.ColumnGroup>
      <StyledTable.Column
        title="Rank"
        dataIndex="rank"
        key="rank"
        width={120}
        render={(rank: number) => {
            if (rank === 1) return <span style={{ fontSize: '18px' }}>🥇</span>;
            if (rank === 2) return <span style={{ fontSize: '18px' }}>🥈</span>;
            if (rank === 3) return <span style={{ fontSize: '18px' }}>🥉</span>;
            return <span>{rank}</span>;
        }}
        />
        <StyledTable.Column
          title="Member"
          dataIndex="name"
          key="member"
          render={(_, record: { name: string; role: string }) => (
            <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
              <Avatar
                style={{
                  backgroundColor: getRandomAvatarColor(),
                  color: '#111',
                  fontWeight: 500,
                }}
              >
                {getInitials(record.name)}
              </Avatar>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{record.name}</span>
                <span style={{ fontSize: "12px", color: "gray" }}>{record.role}</span>
              </div>
            </div>
          )}
          width={250}
        />
        <StyledTable.Column
          title="Hours Worked"
          dataIndex="hoursWorked"
          key="hoursWorked"
          sorter={(a, b) => a.hoursWorked - b.hoursWorked}
          width={180}
        />
        <StyledTable.Column
          title="Tasks Completed"
          dataIndex="tasksCompleted"
          key="tasksCompleted"
          sorter={(a, b) => a.tasksCompleted - b.tasksCompleted}
          width={180}
        />
        <StyledTable.Column
          title="Hours Deviation"
          dataIndex="hoursDeviation"
          key="hoursDeviation"
          sorter={(a, b) => a.hoursDeviation - b.hoursDeviation}
          width={180}
          render={(_, record: any) => (
            <span style={{
              color: getColorByDeviation(record.hoursDeviation),
              fontWeight: "normal",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}>
              {record.hoursDeviation}
              {getIconByDeviation(record.hoursDeviation)}
            </span>
          )}
        />
        <StyledTable.Column
          title="Compliance"
          dataIndex="compliance"
          key="compliance"
          render={(progress: number | undefined) => (
            progress !== undefined ? (
              <Tooltip key={progress} title={`${progress}%`} placement="left">
                <Progress
                  percent={progress}
                  showInfo={false}
                  strokeColor={getColorByPercent(progress)}
                />
              </Tooltip>
            ) : null
          )}
          width={180}
        />
      </StyledTable.ColumnGroup>
    </StyledTable>
  );
};
