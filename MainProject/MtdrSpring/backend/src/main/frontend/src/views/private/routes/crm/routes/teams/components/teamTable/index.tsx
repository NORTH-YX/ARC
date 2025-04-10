import { Progress, Tooltip, Avatar } from "antd";
import { StyledTable, StyledSegmented } from "./elements"
import { employeeTestData } from "./testData"

  
  const getColorByPercent = (percent: number): string => {
    if (percent < 40) return '#ff4d4f';       // Red
    if (percent < 80) return '#faad14';       // Orange
    return '#52c41a';                         // Green
  };


export const TeamTable = () => {
  return (
    <StyledTable
    dataSource={employeeTestData}
    title={() => (
        <div>
            <StyledSegmented 
                options={['This Week', 'This Month', 'All Time']}/>
        </div>
    )}
    scroll={{ x: "max-content", y: "max-content" }}
    >
        <StyledTable.ColumnGroup>
            <StyledTable.Column 
                title="Rank"
                dataIndex="rank"
                key="rank"
                width={180}
                />
            <StyledTable.Column 
                title="Member"
                dataIndex="name"
                key="member"
                render={(_, record: { name: string; jobTitle: string }) => (
                    <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                        <Avatar />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span>{record.name}</span>
                            <span style={{ fontSize: "12px", color: "gray" }}>{record.jobTitle}</span>
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
  )
}

