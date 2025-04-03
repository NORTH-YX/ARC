import ProjectsTable from './components/projectsTable';
import { Card, Typography } from 'antd';
import {
    FolderFilled, CheckOutlined, ClockCircleFilled, UsergroupAddOutlined,
} from "@ant-design/icons";
import { IconWrapper } from './elements';
import { User } from '../../../../../../interfaces/user';

const { Text } = Typography;

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const isAdmin = user?.role === 'admin';
  
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "5px", }}>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "20px", padding: "20px 40px 0" }}>
        <h1 style={{ marginBottom: "5px" }}>Projects</h1>
        <p style={{ color: "#6B7280" }}>
          {isAdmin ? 'Manage all organization projects' : `Manage ${user?.name?.split(' ')[0]}'s projects`}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: "20px 40px 40px", }}>
        <Card style={{ width: "250px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <IconWrapper bgColor="#ffe5e5">
            <FolderFilled style={{ color: "#C74634", fontSize: "20px" }} />
            </IconWrapper>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text type='secondary'>Total Projects</Text>
              <Text>24</Text>
            </div>
          </div>
        </Card>

        <Card style={{ width: "250px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <IconWrapper bgColor="#D1FAE5">
            <CheckOutlined style={{ color: "#059669", fontSize: "20px" }} />
            </IconWrapper>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text type='secondary'>Completed</Text>
              <Text>24</Text>
            </div>
          </div>
        </Card>

        <Card style={{ width: "250px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <IconWrapper bgColor="#FEF3C7">
            <ClockCircleFilled style={{ color: "#D97706", fontSize: "20px" }} />
            </IconWrapper>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text type='secondary'>Total Projects</Text>
              <Text>24</Text>
            </div>
          </div>
        </Card>

        <Card style={{ width: "250px" }}>
          <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
            <IconWrapper bgColor="#EDE9FE">
            <UsergroupAddOutlined style={{ color: "#7C3AED", fontSize: "20px" }} />
            </IconWrapper>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text type='secondary'>Team Members</Text>
              <Text>24</Text>
            </div>
          </div>
        </Card>

      </div>
      <ProjectsTable />
    </div>
  )
}

export default Projects

