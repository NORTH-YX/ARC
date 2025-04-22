import { Button, Select, Tooltip, Dropdown } from "antd";
import { format } from "date-fns";
import { PlusOutlined, EllipsisOutlined } from "@ant-design/icons";
import type { SorterResult } from "antd/es/table/interface";
import type { MenuProps } from "antd";
import useTaskStore from "../../../../../../../../modules/tasks/store/useTaskStore.tsx";
import { getStatusTag } from "../../../utils.tsx";
import { StyledTable } from "./styles.ts";
import { Task } from "../../../../../../../../interfaces/task/index";

const TASK_STATUSES = ["To Do", "In Progress", "Completed", "Blocked"];

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  .status-select .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
  }
  .status-select-to-do .ant-select-selector {
    background-color: #DBEAFE !important;
  }
  .status-select-in-progress .ant-select-selector {
    background-color: #FEF3C7 !important;
  }
  .status-select-completed .ant-select-selector {
    background-color: #D1FAE5 !important;
  }
  .status-select-blocked .ant-select-selector {
    background-color: #FEE2E2 !important;
  }
  .status-select-dropdown .ant-select-item-option-selected {
    background-color: #F3F4F6 !important;
  }
  .status-select-dropdown .ant-select-item-option:hover {
    background-color: #F9FAFB !important;
  }
`;
document.head.appendChild(styleSheet);

const TasksTable: React.FC = () => {
  const store = useTaskStore();

  const handleEdit = (taskId: number) => {
    const task = store.getTaskById?.(taskId);
    if (task) {
      store.setSelectedTask(task);
      store.openTaskModal();
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await store.deleteTask?.(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleStatusChange = async (newStatus: string, task: Task) => {
    try {
      await store.updateTask?.(task.taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleCreateTask = () => {
    store.setSelectedTask(null); // Ensure no task is selected
    store.openTaskModal(); // Open modal for creating a new task
  };

  const handleTableChange = (
    _: any,
    __: any,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    console.log("Sort change:", sorter);
  };

  // Custom date comparison for sorting
  const compareDates = (a: string | null, b: string | null) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    return new Date(a).getTime() - new Date(b).getTime();
  };

  // Format date in a more readable way: "Apr 13, 6:01 p.m."
  const formatReadableDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          padding: "16px",
          borderRadius: "8px 8px 0 0",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: '100%',
          marginBottom: "-1px", // Eliminate gap between header and table
        }}
      >
        <h2 style={{ margin: 0 }}>Recent Tasks</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateTask}
        >
          Create Task
        </Button>
      </div>
      
      <StyledTable
        dataSource={store.filteredTasks || []}
        rowKey="taskId"
        onChange={handleTableChange}
        pagination={{ pageSize: 10 }}
      >
        <StyledTable.Column
          title="Task Name"
          dataIndex="taskName"
          key="taskName"
          ellipsis={false}
          width="20%"
        />
        <StyledTable.Column
          title="Status"
          dataIndex="status"
          key="status"
          width={130}
          ellipsis={true}
          render={(status: string, record: Task) => {
            //const statusInfo = getStatusTag(status);
            return (
              <Select
                value={status}
                style={{ width: 120 }}
                onChange={(newStatus) => handleStatusChange(newStatus, record)}
                options={TASK_STATUSES.map((statusOption) => {
                  const optionInfo = getStatusTag(statusOption);
                  return {
                    value: statusOption,
                    label: optionInfo.label,
                  };
                })}
                className="status-select"
                rootClassName={`status-select-${status
                  .toLowerCase()
                  .replace(" ", "-")}`}
                popupClassName="status-select-dropdown"
              />
            );
          }}
        />
        <StyledTable.Column
          title="Sprint"
          dataIndex={["sprint", "sprintName"]}
          key="sprint"
          width={100}
          ellipsis={true}
          sorter={{
            compare: (a: any, b: any) => {
              const sprintA = a.sprint?.sprintName || "";
              const sprintB = b.sprint?.sprintName || "";
              return sprintA.localeCompare(sprintB);
            },
          }}
        />
        <StyledTable.Column
          title="Creation Date"
          dataIndex="creationDate"
          key="creationDate"
          width={140}
          ellipsis={true}
          render={(date: string) =>
            formatReadableDate(date)
          }
          sorter={{
            compare: (a: any, b: any) =>
              compareDates(a.creationDate, b.creationDate),
          }}
        />
        <StyledTable.Column
          title="Estimated Finish"
          dataIndex="estimatedFinishDate"
          key="estimatedFinishDate"
          width={140}
          ellipsis={true}
          render={(date: string) =>
            date ? formatReadableDate(date) : "Not Set"
          }
          sorter={{
            compare: (a: any, b: any) =>
              compareDates(a.estimatedFinishDate, b.estimatedFinishDate),
          }}
        />
        <StyledTable.Column
          title="Priority"
          dataIndex="priority"
          key="priority"
          width={80}
          ellipsis={true}
        />
        <StyledTable.Column
          title="User"
          dataIndex={["user", "name"]}
          key="user"
          width={120}
          ellipsis={true}
        />
        <StyledTable.Column
          title="Real Finish"
          dataIndex="realFinishDate"
          key="realFinishDate"
          width={140}
          ellipsis={true}
          render={(date: string | null) =>
            date
              ? formatReadableDate(date)
              : "Not Finished"
          }
          sorter={{
            compare: (a: any, b: any) =>
              compareDates(a.realFinishDate, b.realFinishDate),
          }}
        />
        <StyledTable.Column
          title="Action"
          key="action"
          width={80}
          ellipsis={true}
          render={(_: any, record: any) => {
            const items: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit',
                onClick: () => handleEdit(record.taskId),
              },
              {
                key: 'delete',
                label: 'Delete',
                danger: true,
                onClick: () => handleDelete(record.taskId),
              },
            ];
            
            return (
              <Tooltip title="Task Actions">
                <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                  <Button 
                    type="text" 
                    icon={<EllipsisOutlined style={{ fontSize: '20px' }} />} 
                    onClick={(e) => e.preventDefault()}
                  />
                </Dropdown>
              </Tooltip>
            );
          }}
        />
      </StyledTable>
    </div>
  );
};

export default TasksTable;
