import { useState } from 'react';
import { StyledTable, StyledButton } from './elements';
import { Select, Input } from 'antd';
import { testdata } from './testData';
import { MoreOutlined } from "@ant-design/icons";
import { getStatusTag } from '../../../utils';

const { Search } = Input;

const ProjectsTable = () => {
    const [_, setSearchText] = useState('');

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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Active Projects</span>
          <div>
          <Search 
            placeholder="Search something..."
            allowClear
            onSearch={(value) => setSearchText(value)}
            style={{ width: 300, marginRight: "10px" }}></Search>
          <Select
            defaultValue="lucy"
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
                { value: 'jack', label: 'Jack' },
                { value: 'lucy', label: 'Lucy' },
                { value: 'Yiminghe', label: 'yiminghe' },
            ]}
            />
          </div>
        </div>
      )}
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
            />
            <StyledTable.Column 
              title="Progress"
              dataIndex="progress"
              key="progress"
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
                  <StyledButton><MoreOutlined style={{ fontSize: "25px" }} /></StyledButton>
                </div>
              )}
            />
          </StyledTable.ColumnGroup>
        </StyledTable>
  )
}

export default ProjectsTable