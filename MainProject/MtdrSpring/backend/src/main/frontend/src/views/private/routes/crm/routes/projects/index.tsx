import ProjectsTable from "./components/projectsTable";
import { Typography, Spin, Result } from "antd";
import {
  FolderFilled,
  CheckOutlined,
  ClockCircleFilled,
  UsergroupAddOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  IconWrapper,
  IndicatorsContainer,
  StyledCard,
  RowContainer,
  ColumnContainer,
  Value,
} from "./elements";
import { User } from "../../../../../../interfaces/user";
import { useProjectBook } from "../../../../../../modules/projects/hooks/useProjectBook";
import useProjectStore from "../../../../../../modules/projects/store/useProjectStore";
import { useDataInitialization } from "../../../../../../modules/projects/hooks/useDataInitialization";

const { Text, Title } = Typography;

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const isAdmin = user?.role === "admin";

  const { data, error, isLoading } = useProjectBook();
  const store = useProjectStore();

  // Initialize the store with data
  useDataInitialization(data, store);
  if (error) {
    return (
      <Result status="500" title="500" subTitle="Failed to load projects." />
    );
  }
  if (isLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "5px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <Title level={2} style={{ marginBottom: "5px" }}>
          Projects
        </Title>
        <p style={{ color: "#6B7280" }}>
          {isAdmin
            ? "Manage all organization projects"
            : `Manage ${user?.name?.split(" ")[0]}'s projects`}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0px 20px 20px",
        }}
      >
        <IndicatorsContainer>
          <StyledCard>
            <RowContainer>
              <IconWrapper $bgColor="#ffe5e5">
                <FolderFilled style={{ color: "#C74634", fontSize: "20px" }} />
              </IconWrapper>
              <ColumnContainer>
                <Text type="secondary">Total Projects</Text>
                <Value color="#C74634">{data?.count}</Value>
              </ColumnContainer>
            </RowContainer>
          </StyledCard>

          <StyledCard>
            <RowContainer>
              <IconWrapper $bgColor="#D1FAE5">
                <CheckOutlined style={{ color: "#059669", fontSize: "20px" }} />
              </IconWrapper>
              <ColumnContainer>
                <Text type="secondary">Completed</Text>
                <Value color="#7C3AED">12</Value>
              </ColumnContainer>
            </RowContainer>
          </StyledCard>

          <StyledCard>
            <RowContainer>
              <IconWrapper $bgColor="#FEF3C7">
                <ClockCircleFilled
                  style={{ color: "#D97706", fontSize: "20px" }}
                />
              </IconWrapper>
              <ColumnContainer>
                <Text type="secondary">In Progress</Text>
                <Value color="#059669">4</Value>
              </ColumnContainer>
            </RowContainer>
          </StyledCard>

          <StyledCard>
            <RowContainer>
              <IconWrapper $bgColor="#EDE9FE">
                <UsergroupAddOutlined
                  style={{ color: "#7C3AED", fontSize: "20px" }}
                />
              </IconWrapper>
              <ColumnContainer>
                <Text type="secondary">Members</Text>
                <Value color="#D97706">8</Value>
              </ColumnContainer>
            </RowContainer>
          </StyledCard>
        </IndicatorsContainer>
      </div>
      <div style={{ padding: "0px 20px" }}>
        <ProjectsTable />
      </div>
    </div>
  );
};

export default Projects;
