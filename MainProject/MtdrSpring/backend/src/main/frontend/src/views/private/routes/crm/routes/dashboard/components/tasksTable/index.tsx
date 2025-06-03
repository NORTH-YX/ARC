import { Button, Space, Select, Tooltip, Dropdown, DatePicker, Input, Typography, Popover } from "antd";
import { format } from "date-fns";
import { PlusOutlined, EllipsisOutlined, SearchOutlined, CalendarOutlined, EditOutlined, UserOutlined, FilterOutlined } from "@ant-design/icons";
import type { SorterResult } from "antd/es/table/interface";
import type { MenuProps } from "antd";
import useTaskStore from "../../../../../../../../modules/tasks/store/useTaskStore.tsx";
import { getStatusTag } from "../../../utils.tsx";
import { StyledTable } from "./styles.ts";
import { Task } from "../../../../../../../../interfaces/task/index";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { User } from "../../../../../../../../interfaces/user/index";
import { Sprint } from "../../../../../../../../interfaces/sprint/index";
import NewTaskModal from "../../../projectDashboard/components/newTaskModal/index.tsx";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const TASK_STATUSES = ["To Do", "In Progress", "Completed", "Blocked"];

// Add custom CSS for date picker styling
const datePickerStyle = document.createElement("style");
datePickerStyle.textContent = `
  .custom-date-picker .ant-picker-input > input::placeholder {
    color: #bbb;
  }
  .custom-date-picker .ant-picker-separator {
    color: #aaa;
  }
  .custom-date-picker {
    border-color: #e0e0e0;
  }
  .custom-date-picker:hover {
    border-color: #4096ff;
  }
  .custom-date-picker .ant-picker-suffix {
    color: #aaa;
  }
  .editable-cell {
    padding: 0 !important;
  }
  .date-cell-content {
    padding: 8px 12px;
    display: flex;
    align-items: center;
    transition: all 0.3s;
  }
  .date-cell-content:hover {
    background-color: rgba(0, 0, 0, 0.02);
    cursor: pointer;
  }
  .date-cell-content .edit-icon {
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .date-cell-content:hover .edit-icon {
    opacity: 0.6;
  }
  .date-picker-popover .ant-picker {
    margin-bottom: 0;
  }
  .date-picker-popover .ant-popover-inner-content {
    padding: 0;
  }
  .ant-picker-dropdown {
    z-index: 1100 !important;
  }
`;
document.head.appendChild(datePickerStyle);

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

// Add custom CSS for user select
const userSelectStyle = document.createElement("style");
userSelectStyle.textContent = `
  .user-select .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
    background-color: #f0f0f0 !important;
  }
  .user-select:hover .ant-select-selector {
    background-color: #e6e6e6 !important;
  }
  .user-select-dropdown .ant-select-item-option-selected {
    background-color: #F3F4F6 !important;
  }
  .user-select-dropdown .ant-select-item-option:hover {
    background-color: #F9FAFB !important;
  }
`;
document.head.appendChild(userSelectStyle);

const TasksTable: React.FC = () => {
  const store = useTaskStore();
  
  // Using the store instead of local state
  const { 
    dateRange, 
    searchText, 
    setDateRange, 
    setSearchText, 
    getFilteredTasks,
    updateTask,
    setSelectedSprintId,
    taskBook
  } = store;

  // State for tracking which date cell is being edited
  const [editingCell, setEditingCell] = useState<{
    taskId: number | null;
    field: string | null;
  }>({ taskId: null, field: null });

  const [users, setUsers] = useState<User[]>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [currentSprintId, setCurrentSprintId] = useState<number | null>(null);
  
  // Get unique sprints and identify the active (current) sprint
  useEffect(() => {
    if (taskBook?.tasks) {
      // Extract unique sprints from tasks
      const uniqueSprints = Array.from(
        new Map(
          taskBook.tasks
            .filter((task: Task) => task.sprint)
            .map((task: Task) => [task.sprint.sprintId, task.sprint])
        ).values()
      ) as Sprint[];
      
      setSprints(uniqueSprints);

      // Find the current sprint (Active or latest by creation date)
      const activeSprint = uniqueSprints.find(sprint => sprint.status === "Active");
      
      if (activeSprint) {
        setCurrentSprintId(activeSprint.sprintId);
      } else if (uniqueSprints.length > 0) {
        // If no active sprint, use the latest sprint by creation date
        const latestSprint = uniqueSprints.reduce((latest, sprint) => {
          return new Date(sprint.creationDate) > new Date(latest.creationDate) ? sprint : latest;
        });
        setCurrentSprintId(latestSprint.sprintId);
      }
    }
  }, [taskBook?.tasks]);
  
  // Set default filter to current sprint when determined
  useEffect(() => {
    if (currentSprintId) {
      setSelectedSprintId(currentSprintId);
    }
  }, [currentSprintId, setSelectedSprintId]);

  // Extract unique users from tasks
  useEffect(() => {
    if (store.taskBook?.tasks) {
      const uniqueUsers = Array.from(
        new Map(
          store.taskBook.tasks
            .filter((task: Task) => task.user)
            .map((task: Task) => [task.user.userId, task.user])
        ).values()
      ) as User[];
      
      setUsers(uniqueUsers);
    }
  }, [store.taskBook]);

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

  // Handle sprint filter change
  const handleSprintFilterChange = (selectedSprintId: number | null) => {
    setSelectedSprintId(selectedSprintId);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedSprintId(null);
    setDateRange([null, null]);
    setSearchText('');
  };

  // Custom date comparison for sorting
  const compareDates = (a: string | null, b: string | null) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    return new Date(a).getTime() - new Date(b).getTime();
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0]?.toDate() || null, dates[1]?.toDate() || null]);
    } else {
      setDateRange([null, null]);
    }
  };

  // Format date in a more readable way: "Apr 13, 6:01 p.m."
  const formatReadableDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return format(date, "MMM d, h:mm a");
  };

  // Handle the date picker change for editable cells
  const handleDateChange = async (date: Dayjs | null, field: string, taskId: number) => {
    if (!date) return;

    const dateValue = date.toDate().toISOString();
    
    try {
      // Update the task with the new date
      await updateTask?.(taskId, { [field]: dateValue });
      
      // Close the date picker
      setEditingCell({ taskId: null, field: null });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  // Render an editable date cell
  const renderEditableDate = (value: string | null, record: Task, field: string) => {
    const isEditing = editingCell.taskId === record.taskId && editingCell.field === field;
    
    const datePicker = (
      <DatePicker
        showTime
        format="MMM D, YYYY h:mm a"
        defaultValue={value ? dayjs(value) : null}
        style={{ width: '240px' }}
        onOk={(date) => handleDateChange(date, field, record.taskId)}
        open={true}
        autoFocus
      />
    );

    return (
      <Popover
        content={datePicker}
        trigger="click"
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) {
            setEditingCell({ taskId: null, field: null });
          }
        }}
        overlayClassName="date-picker-popover"
        overlayStyle={{ zIndex: 1100 }}
        destroyTooltipOnHide
      >
        <div 
          className="date-cell-content"
          onClick={() => {
            setEditingCell({ taskId: record.taskId, field });
          }}
        >
          <Text>{value ? formatReadableDate(value) : field === "realFinishDate" ? "Not Finished" : "Not Set"}</Text>
          <EditOutlined className="edit-icon" style={{ fontSize: '12px' }} />
        </div>
      </Popover>
    );
  };

  const handleUserChange = async (newUserId: number, task: Task) => {
    try {
      // Find the user object
      const selectedUser = users.find(user => user.userId === newUserId);
      if (!selectedUser) return;
      
      await store.updateTask?.(task.taskId, { user: selectedUser });
    } catch (error) {
      console.error("Error updating task user:", error);
    }
  };

  const selectedSprint =
        sprints.find(
          s =>
            s.sprintId ===
            (store.selectedSprintId ||
              (sprints.length > 0 ? sprints[0].sprintId : 1))
        );

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
        <Space>
          <div style={{ marginRight: "16px" }}>
            <RangePicker 
              onChange={handleDateRangeChange}
              placeholder={["Start date", "End date"]}
              style={{ 
                width: 320,
                borderRadius: "4px",
              }}
              allowClear
              separator="→"
              suffixIcon={<CalendarOutlined />}
              format="MMM D, YYYY"
              bordered={true}
              className="custom-date-picker"
            />
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateTask}
          >
            Create Task
          </Button>
        </Space>
      </div>
      
      <div 
        style={{ 
          padding: "10px 16px", 
          backgroundColor: "white", 
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap"
        }}
      >
        <Space size="middle">
          <Input 
            placeholder="Search tasks" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="Sprint"
            style={{ width: 130 }}
            value={store.selectedSprintId}
            onChange={(value) => handleSprintFilterChange(value)}
            options={sprints.map(sprint => ({
              value: sprint.sprintId,
              label: sprint.sprintName
            }))}
            suffixIcon={<FilterOutlined style={{ color: store.selectedSprintId ? '#1890ff' : undefined }} />}
            bordered
          />
        </Space>
        
        {(store.selectedSprintId !== null || dateRange[0] !== null || searchText) && (
          <Button 
            onClick={handleClearFilters}
            type="link"
            style={{ color: '#1890ff', fontWeight: 500 }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {store.isTaskModalOpen && selectedSprint && (
        <NewTaskModal
          onCancel={store.closeTaskModal}
          onCreate={async (taskData) => {
            await store.createTask(taskData);
            store.closeTaskModal();
          }}
          sprint={selectedSprint}
        />
      )}
      
      <StyledTable
        dataSource={getFilteredTasks()}
        rowKey="taskId"
        onChange={handleTableChange}
        pagination={{ pageSize: 35 }}
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
          ellipsis={false}
          render={(status: string, record: Task) => (
            <div style={{ width: '120px' }}>
              <Select
                value={status}
                style={{ width: '100%' }}
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
                dropdownStyle={{ zIndex: 1100 }}
              />
            </div>
          )}
        />
        <StyledTable.Column
          title="Sprint"
          dataIndex={["sprint", "sprintName"]}
          key="sprint"
          width={130}
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
          className="editable-cell"
          render={(date: string, record: Task) => renderEditableDate(date, record, "creationDate")}
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
          className="editable-cell"
          render={(date: string, record: Task) => renderEditableDate(date, record, "estimatedFinishDate")}
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
          width={150}
          ellipsis={false}
          render={(_, record: Task) => (
            <div style={{ width: '130px' }}>
              <Select
                value={record.user?.userId}
                style={{ width: '100%' }}
                onChange={(newUserId) => handleUserChange(newUserId, record)}
                options={users.map((user) => ({
                  value: user.userId,
                  label: user.name,
                }))}
                className="user-select"
                popupClassName="user-select-dropdown"
                dropdownStyle={{ zIndex: 1100 }}
                placeholder="Assign user"
                suffixIcon={<UserOutlined />}
                showSearch
                optionFilterProp="label"
              />
            </div>
          )}
        />
        <StyledTable.Column
          title="Real Finish"
          dataIndex="realFinishDate"
          key="realFinishDate"
          width={140}
          ellipsis={true}
          className="editable-cell"
          render={(date: string | null, record: Task) => renderEditableDate(date, record, "realFinishDate")}
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
