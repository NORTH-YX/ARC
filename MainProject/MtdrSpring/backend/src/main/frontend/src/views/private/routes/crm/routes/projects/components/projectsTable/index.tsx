import {
  StyledTable,
  StyledProgress,
  Hearder,
  StytledSearchDesktop,
  StytledSearchMobile,
  StyledButton,
  IconWrapper,
} from "./elements";
import { Select, Tooltip, Avatar, Popover, Button, Typography } from "antd";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MobileFilled,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Project,
  ProjectCreate,
  ProjectUpdate,
} from "../../../../../../../../interfaces/project";
import { getProjectStatus } from "../../../utils";
import { Link } from "react-router-dom";
import DeleteProjectModal from "../deleteModal";
import EditProjectModal from "../editModal";

const { Text } = Typography;


interface ProjectsTableProps {
  filteredProjects: Project[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  setSelectedProject: (project: Project) => void;
  selectedProject: Project | null;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
  isDeleteModalOpen: boolean;
  openEditModal: () => void;
  closeEditModal: () => void;
  isEditModalOpen: boolean;
  createProject: (projectData: ProjectCreate) => void;
  editProject: (projectId: number, projectData: ProjectUpdate) => void;
  confirmLoading: boolean;
  deleteProject: (projectId: number) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  filteredProjects,
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  openDeleteModal,
  closeDeleteModal,
  isDeleteModalOpen,
  openEditModal,
  closeEditModal,
  isEditModalOpen,
  setSelectedProject,
  selectedProject,
  createProject,
  editProject,
  confirmLoading,
  deleteProject,
}) => {
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  const getActions = (record: any) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Link to={`/projectDashboard/${record.projectId}`}>
        <StyledButton
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedProject(record);
          }}
        >
          See Details
        </StyledButton>
      </Link>
      <StyledButton
        type="text"
        icon={<EditOutlined />}
        onClick={() => {
          setSelectedProject(record);
          openEditModal();
        }}
      >
        Edit
      </StyledButton>
      <StyledButton
        type="text"
        icon={<DeleteOutlined />}
        onClick={() => {
          setSelectedProject(record);
          openDeleteModal();
        }}
      >
        Delete
      </StyledButton>
    </div>
  );

  return (
    <>
      <StyledTable
        dataSource={filteredProjects}
        title={() => (
          <Hearder>
            <span style={{ fontWeight: "400" }}>Active Projects</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <StytledSearchDesktop
                placeholder="Search something..."
                allowClear
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={setSearchQuery}
                style={{ width: 300, marginRight: "10px" }}
              />
              <Select
                value={selectedStatus || "allProjects"}
                style={{ width: 120 }}
                onChange={handleStatusChange}
                options={[
                  { value: "allProjects", label: "All Projects" },
                  { value: "on-hold", label: "On Hold" },
                  { value: "Active", label: "In Progress" },
                  { value: "Completed", label: "Completed" },
                ]}
              />
              <Button
                type="primary"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  openEditModal();
                }}
                icon={<PlusOutlined />}
              >
                Create Project
              </Button>
            </div>
            <StytledSearchMobile
              placeholder="Search something..."
              allowClear
              onSearch={(value) => setSearchQuery(value)}
              style={{ width: "100%" }}
            />
          </Hearder>
        )}
        scroll={{ x: "max-content", y: "max-content" }}
      >
        <StyledTable.ColumnGroup key="column-group">
          <StyledTable.Column
            title="Project Name"
            dataIndex="projectName"
            key="projectName"
            render={(projectName: string, record: any) => (
              <Link to={`/projectDashboard/${record.projectId}`}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                  onClick={() => {
                    setSelectedProject(record);
                  }}
                >
                  <IconWrapper bgColor="#DBEAFE">
                    <MobileFilled style={{ fontSize: "20px" }} />
                  </IconWrapper>
                  <p style={{ color: "#000" }}>{projectName}</p>
                </div>
              </Link>
            )}
          />
          <StyledTable.Column
            title="Team"
            dataIndex="team"
            key="team"
            render={(
              _team: Array<{ name: string; avatar: string }>,
              record: any
            ) => (
              <Avatar.Group
                key={`team-${record.projectId}`}
                max={{
                  count: 2,
                  style: { color: "#f56a00", backgroundColor: "#fde3cf" },
                }}
              >
                {/* TODO: Add team members to projects endpoint */}
                {/* {team?.map((member, index) => (
                <Avatar
                  key={`${record.projectId}-member-${index}`}
                  style={{
                    backgroundColor: "#d9d9d9",
                    color: "#111",
                    fontWeight: 500,
                  }}
                >
                  {getInitials(member.name)}
                </Avatar>
              ))} */}
              </Avatar.Group>
            )}
          />
          <StyledTable.Column
            title="Progress"
            dataIndex="progress"
            key="progress"
            render={(progress: number, record: any) => (
              <Tooltip
                key={`progress-${record.projectId}`}
                title={`${progress}%`}
                placement="right"
              >
                <StyledProgress
                  percent={progress}
                  showInfo={false}
                  strokeColor="#C74634"
                />
              </Tooltip>
            )}
            width={150}
          />
          <StyledTable.Column
            title="Deadline"
            dataIndex="estimatedFinishDate"
            key="estimatedFinishDate"
            render={(estimatedFinishDate: string, record: any) => (
              <Text key={`deadline-${record.projectId}`} type="secondary">
                {new Date(estimatedFinishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </Text>
            )}
          />
          <StyledTable.Column
            title="Status"
            dataIndex="status"
            key="status"
            render={(status: string, record: any) => (
              <span key={`status-${record.projectId}`}>
                {getProjectStatus(status)}
              </span>
            )}
          />
          <StyledTable.Column
            title="Actions"
            key="actions"
            render={(_: any, record: any) => (
              <div
                key={`actions-${record.projectId}`}
                style={{ padding: "5px" }}
              >
                <Popover
                  placement="right"
                  title={null}
                  content={getActions(record)}
                  arrow={false}
                  trigger="click"
                  overlayInnerStyle={{ padding: "5px 0px" }}
                >
                  <Button
                    style={{
                      fontSize: "20px",
                      color: "#9CA3AF",
                    }}
                    type="link"
                    icon={<MoreOutlined />}
                  />
                </Popover>
              </div>
            )}
          />
        </StyledTable.ColumnGroup>
      </StyledTable>

      <DeleteProjectModal
        project={selectedProject}
        visible={isDeleteModalOpen}
        onCancel={closeDeleteModal}
        onDelete={() => {
          if (selectedProject) {
            deleteProject(selectedProject.projectId);
            closeDeleteModal();
          }
        }}
      />
      <EditProjectModal
        visible={isEditModalOpen}
        onCancel={closeEditModal}
        project={selectedProject}
        onEdit={(projectData) => {
          if (selectedProject) {
            editProject(selectedProject?.projectId, projectData);
            closeEditModal();
          }
        }}
        onCreate={(projectData) => {
          createProject(projectData);
          closeEditModal();
        }}
        confirmLoading={confirmLoading}
      />
    </>
  );
};

export default ProjectsTable;
