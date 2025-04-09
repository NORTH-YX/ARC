import {
  StyledTable,
  StyledButton,
  StyledProgress,
  Hearder,
  StytledSearchDesktop,
  StytledSearchMobile,
} from "./elements";
import { Select, Tooltip, Avatar } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { getStatusTag } from "../../../utils";
import { useProjectBook } from "../../../../../../../../modules/projects/hooks/useProjectBook";
import useProjectStore from "../../../../../../../../modules/projects/store/useProjectStore";
import { useDataInitialization } from "../../../../../../../../modules/projects/hooks/useDataInitialization";

// Ya se creo en otro archivo(PopView), ver como manejarla en ambos
// const getInitials = (name: string): string => {
//   const names = name.split(" ");
//   const initials = names
//     .slice(0, 2)
//     .map((n) => n.charAt(0).toUpperCase())
//     .join("");
//   return initials;
// };

const ProjectsTable = () => {
  const { data, error, isLoading } = useProjectBook();
  const store = useProjectStore();
  const {
    filteredProjects,
    searchQuery,
    selectedStatus,
    setSearchQuery,
    setSelectedStatus
  } = store;

  // Initialize the store with data
  useDataInitialization(data, store);
  console.log("dataaaa", data);
  if (error) return <div>Failed to load projects</div>;
  if (isLoading) return <div>Loading...</div>;

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === 'allProjects' ? null : value);
  };

  return (
    <StyledTable
      dataSource={filteredProjects}
      title={() => (
        <Hearder>
          <span style={{ fontWeight: "400" }}>Active Projects</span>
          <div>
            <StytledSearchDesktop
              placeholder="Search something..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={setSearchQuery}
              style={{ width: 300, marginRight: "10px" }}
            />
            <Select
              value={selectedStatus || 'allProjects'}
              style={{ width: 120 }}
              onChange={handleStatusChange}
              options={[
                { value: "allProjects", label: "All Projects" },
                { value: "toDo", label: "To Do" },
                { value: "inProgress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ]}
            />
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
        />
        <StyledTable.Column
          title="Team"
          dataIndex="team"
          key="team"
          render={(_team: Array<{ name: string; avatar: string }>, record: any) => (
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
            <Tooltip key={`progress-${record.projectId}`} title={`${progress}%`} placement="right">
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
          dataIndex="deadline"
          key="deadline"
        />
        <StyledTable.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: string, record: any) => (
            <span key={`status-${record.projectId}`}>
              {getStatusTag(status)}
            </span>
          )}
        />
        <StyledTable.Column
          title="Actions"
          key="actions"
          render={(_: any, record: any) => (
            <div key={`actions-${record.projectId}`} style={{ padding: "5px" }}>
              <StyledButton
                icon={<MoreOutlined style={{ fontSize: "25px" }} />}
              />
            </div>
          )}
        />
      </StyledTable.ColumnGroup>
    </StyledTable>
  );
};

export default ProjectsTable;
