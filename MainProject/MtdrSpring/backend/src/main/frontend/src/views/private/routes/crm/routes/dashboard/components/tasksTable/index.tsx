import { Button, Space, Select } from 'antd';
import { format } from 'date-fns';
import { PlusOutlined } from '@ant-design/icons';
import type { SorterResult } from 'antd/es/table/interface';
import useTaskStore from '../../../../../../../../modules/tasks/store/useTaskStore.tsx';
import { getStatusTag } from '../../../utils.tsx';
import { StyledTable } from './styles.ts';
import { Task } from '../../../../../../../../interfaces/task/index';

const TASK_STATUSES = ['To Do', 'In Progress', 'Completed'];

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
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (newStatus: string, task: Task) => {
    try {
      await store.updateTask?.(task.taskId, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleCreateTask = () => {
    store.setSelectedTask(null); // Ensure no task is selected
    store.openTaskModal(); // Open modal for creating a new task
  };

  const handleTableChange = (_: any, __: any, sorter: SorterResult<any> | SorterResult<any>[]) => {
    console.log('Sort change:', sorter);
  };

  // Custom date comparison for sorting
  const compareDates = (a: string | null, b: string | null) => {
    if (!a && !b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    return new Date(a).getTime() - new Date(b).getTime();
  };

  return (
    <StyledTable 
      dataSource={store.filteredTasks || []}
      rowKey="taskId"
      onChange={handleTableChange}
    >
      <StyledTable.ColumnGroup
        title={
          <div
            style={{
              marginTop: "-10px",
              marginLeft: "-13px",
              padding: "10px",
              borderRadius: "8px 8px 0 0",
              backgroundColor: "white",
              width: "101%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
        }
      >
        <StyledTable.Column
          title="Task Name"
          dataIndex="taskName"
          key="taskName"
        />
        <StyledTable.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: string, record: Task) => (
            <Select
              value={status}
              style={{ width: 130 }}
              onChange={(newStatus) => handleStatusChange(newStatus, record)}
            >
              {TASK_STATUSES.map((statusOption) => (
                <Select.Option key={statusOption} value={statusOption}>
                  {getStatusTag(statusOption)}
                </Select.Option>
              ))}
            </Select>
          )}
        />
        <StyledTable.Column 
          title="Sprint" 
          dataIndex={["sprint", "sprintName"]}
          key="sprint"
          sorter={{
            compare: (a: any, b: any) => {
              const sprintA = a.sprint?.sprintName || '';
              const sprintB = b.sprint?.sprintName || '';
              return sprintA.localeCompare(sprintB);
            }
          }}
        />
        <StyledTable.Column
          title="Creation Date"
          dataIndex="creationDate"
          key="creationDate"
          render={(date: string) => format(new Date(date), "yyyy-MM-dd HH:mm:ss")}
          sorter={{
            compare: (a: any, b: any) => compareDates(a.creationDate, b.creationDate)
          }}
        />
        <StyledTable.Column
          title="Estimated Finish"
          dataIndex="estimatedFinishDate"
          key="estimatedFinishDate"
          render={(date: string) => date ? format(new Date(date), "yyyy-MM-dd HH:mm:ss") : "Not Set"}
          sorter={{
            compare: (a: any, b: any) => compareDates(a.estimatedFinishDate, b.estimatedFinishDate)
          }}
        />
        <StyledTable.Column
          title="Priority"
          dataIndex="priority"
          key="priority"
        />
        <StyledTable.Column 
          title="User" 
          dataIndex={["user", "name"]}
          key="user" 
        />
        <StyledTable.Column
          title="Real Finish"
          dataIndex="realFinishDate"
          key="realFinishDate"
          render={(date: string | null) =>
            date ? format(new Date(date), "yyyy-MM-dd HH:mm:ss") : "Not Finished"
          }
          sorter={{
            compare: (a: any, b: any) => compareDates(a.realFinishDate, b.realFinishDate)
          }}
        />
        <StyledTable.Column
          title="Action"
          key="action"
          render={(_: any, record: any) => (
            <Space size="middle">
              <Button 
                type="primary"
                onClick={() => handleEdit(record.taskId)}
              >
                Edit
              </Button>
              <Button 
                danger
                onClick={() => handleDelete(record.taskId)}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </StyledTable.ColumnGroup>
    </StyledTable>
  );
};

export default TasksTable;
