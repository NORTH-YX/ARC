import { Button, Space } from 'antd';
import { format } from 'date-fns';
import { useTaskBook } from '../../../../../../../../modules/tasks/hooks/useTaskBook';
import { useDataInitialization } from '../../../../../../../../modules/tasks/hooks/useDataInitialization';
import useTaskStore from '../../../../../../../../modules/tasks/store/useTaskStore.tsx';
import { getStatusTag } from '../../../utils.tsx';
import { StyledTable } from './styles.ts';

const TasksTable: React.FC = () => {
  const { data, error, isLoading, mutate } = useTaskBook();
  console.log('data', data);
  const store = useTaskStore();
  
  useDataInitialization(data, store);

  if (error) return <div>Failed to load tasks</div>;
  if (isLoading) return <div>Loading...</div>;

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
      mutate(); // Refresh the data
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <StyledTable 
      dataSource={store.filteredTasks || []}
      loading={isLoading}
      rowKey="taskId"
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
              justifyContent: "flex-start",
            }}
          >
            <h2 style={{ margin: 0 }}>Recent Tasks</h2>
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
          render={(status: string) => getStatusTag(status)}
        />
        <StyledTable.Column 
          title="Sprint" 
          dataIndex="sprintId" 
          key="sprintId" 
        />
        <StyledTable.Column
          title="Creation Date"
          dataIndex="creationDate"
          key="creationDate"
          render={(date: string) => format(new Date(date), "yyyy-MM-dd HH:mm:ss")}
        />
        <StyledTable.Column
          title="Estimated Finish"
          dataIndex="estimatedFinishDate"
          key="estimatedFinishDate"
          render={(date: string) => date ? format(new Date(date), "yyyy-MM-dd HH:mm:ss") : "Not Set"}
        />
        <StyledTable.Column
          title="Priority"
          dataIndex="priority"
          key="priority"
        />
        <StyledTable.Column 
          title="User" 
          dataIndex="userId" 
          key="userId" 
        />
        <StyledTable.Column
          title="Real Finish"
          dataIndex="realFinishDate"
          key="realFinishDate"
          render={(date: string | null) =>
            date ? format(new Date(date), "yyyy-MM-dd HH:mm:ss") : "Not Finished"
          }
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
