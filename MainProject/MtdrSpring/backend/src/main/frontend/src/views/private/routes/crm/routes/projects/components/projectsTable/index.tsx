import { useState } from "react";
import {
  StyledTable,
  StyledButton,
  StyledProgress,
  Hearder,
  StytledSearchDesktop,
  StytledSearchMobile,
} from "./elements";
import { Select, Tooltip, Avatar } from "antd";
import { testdata } from "./testData";
import { MoreOutlined } from "@ant-design/icons";
import { getStatusTag } from "../../../utils";
import { useDataInitialization } from "../../../../../../../../modules/projects/hooks/useDataInitialization";
import { useProjectBook } from "../../../../../../../../modules/projects/hooks/useProjectBook";
import useProjectStore from "../../../../../../../../modules/projects/store/useProjectStore";

// Ya se creo en otro archivo(PopView), ver como manejarla en ambos
const getInitials = (name: string): string => {
  const names = name.split(" ");
  const initials = names
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
  return initials;
};

const ProjectsTable = () => {
  const { data, error, isLoading, mutate } = useProjectBook();
  console.log("dataaaa", data);
  const store = useProjectStore();
  useDataInitialization(data, store);
  if (error) return <div>Failed to load projects</div>;
  if (isLoading) return <div>Loading...</div>;

  const [_, setSearchText] = useState("");

  // const filteredData = data.filter(item =>
  // item.name.toLowerCase().includes(searchText.toLowerCase())
  // );

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <StyledTable
      dataSource={testdata}
      title={() => (
        <Hearder>
          <span style={{ fontWeight: "400" }}>Active Projects</span>
          <div>
            <StytledSearchDesktop
              placeholder="Search something..."
              allowClear
              onSearch={(value) => setSearchText(value)}
              style={{ width: 300, marginRight: "10px" }}
            />
            <Select
              defaultValue="allProjects"
              style={{ width: 120 }}
              onChange={handleChange}
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
            onSearch={(value) => setSearchText(value)}
            style={{ width: "100%" }}
          />
        </Hearder>
      )}
      scroll={{ x: "max-content", y: "max-content" }}
    >
      <StyledTable.ColumnGroup>
        <StyledTable.Column
          title="Project Name"
          dataIndex="projectName"
          key="projectName"
        />
        <StyledTable.Column
          title="Team"
          dataIndex="team"
          key="team"
          render={(team: Array<{ name: string; avatar: string }>) => (
            <Avatar.Group
              max={{
                count: 2,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
            >
              {team.map((member, index) => (
                <Avatar
                  key={index}
                  style={{
                    backgroundColor: "#d9d9d9",
                    color: "#111",
                    fontWeight: 500,
                  }}
                >
                  {getInitials(member.name)}
                </Avatar>
              ))}
            </Avatar.Group>
          )}
        />
        <StyledTable.Column
          title="Progress"
          dataIndex="progress"
          key="progress"
          render={(progress: number) => (
            <Tooltip title={`${progress}%`} placement="right">
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
          render={(status: string) => getStatusTag(status)}
        />
        <StyledTable.Column
          title="Actions"
          key="actions"
          render={() => (
            <div style={{ padding: "5px" }}>
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
