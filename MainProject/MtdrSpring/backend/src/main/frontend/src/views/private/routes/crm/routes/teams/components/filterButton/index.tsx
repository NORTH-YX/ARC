import { Button, Checkbox, Dropdown, Menu } from "antd";
import { FilterFilled } from "@ant-design/icons";
import { useState } from "react";

const { SubMenu } = Menu;

const options = [
  {
    key: '1',
    label: 'Role',
    children: [
      { key: '1-1', label: 'Designer' },
      { key: '1-2', label: 'Developer' },
    ],
  },
  {
    key: '2',
    label: 'Work modality',
    children: [
      { key: '2-1', label: 'Remote' },
      { key: '2-2', label: 'On-site' },
    ],
  },
];

export const FilterButton = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheck = (key: string, checked: boolean) => {
    setCheckedItems((prev) =>
      checked ? [...prev, key] : prev.filter((item) => item !== key)
    );
  };

  const menu = (
    <Menu
      selectable={false}
      onClick={(e) => e.domEvent.stopPropagation()} // prevent closing on click
    >
      {options.map((group) => (
        <SubMenu key={group.key} title={group.label}>
          {group.children?.map((item) => (
            <Menu.Item key={item.key}>
              <Checkbox
                checked={checkedItems.includes(item.key)}
                onChange={(e) => {
                  e.stopPropagation(); // prevent closing when checkbox is clicked
                  handleCheck(item.key, e.target.checked);
                }}
              >
                {item.label}
              </Checkbox>
            </Menu.Item>
          ))}
        </SubMenu>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomLeft">
      <Button icon={<FilterFilled />}>
        Filter
      </Button>
    </Dropdown>
  );
};
