import { Button, Checkbox, Dropdown } from "antd";
import { FilterFilled, DownOutlined } from "@ant-design/icons";
import { OptionsContainer } from "./elements";
import { useState } from "react";

const options = [
  {
    key: "1",
    label: "Role",
    stateKey: "role",
    children: [
      { key: "Designer", label: "Designer" },
      { key: "Developer", label: "Developer" },
    ],
  },
  {
    key: "2",
    label: "Work modality",
    stateKey: "modality",
    children: [
      { key: "Remote", label: "Remote" },
      { key: "On-site", label: "On-site" },
      { key: "Hybrid", label: "Hybrid" },
    ],
  },
];

interface Filters {
  roleFilter: string[];
  workModalityFilter: string[];
  setRoleFilter: (roleFilters: string[]) => void;
  setWorkModalityFilter: (workModalityFilters: string[]) => void;
}

export const FilterButton: React.FC<Filters> = ({
  roleFilter,
  workModalityFilter,
  setRoleFilter,
  setWorkModalityFilter,
}) => {
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleCheck = (
    groupKey: string,
    itemKey: string,
    checked: boolean
  ) => {
    const group = options.find((g) => g.key === groupKey);
    if (!group) return;

    const isRole = group.stateKey === "role";
    const current = isRole ? roleFilter : workModalityFilter;
    const setter = isRole ? setRoleFilter : setWorkModalityFilter;

    const updated = checked
      ? [...current, itemKey]
      : current.filter((k) => k !== itemKey);

    setter(updated);
  };

  const content = (
    <OptionsContainer>
      {options.map((group) => (
        <div key={group.key} style={{ marginBottom: 10 }}>
          <div
            onClick={() => toggleGroup(group.key)}
            style={{
              cursor: "pointer",
              fontWeight: 500,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {group.label}
            <DownOutlined
              rotate={openGroups.includes(group.key) ? 180 : 0}
              style={{ fontSize: 12 }}
            />
          </div>
          {openGroups.includes(group.key) && (
            <div style={{ paddingLeft: 10, marginTop: 5 }}>
              {group.children?.map((item) => {
                const isRole = group.stateKey === "role";
                const checked = isRole
                  ? roleFilter.includes(item.key)
                  : workModalityFilter.includes(item.key);

                return (
                  <div key={item.key}>
                    <Checkbox
                      checked={checked}
                      onChange={(e) =>
                        handleCheck(group.key, item.key, e.target.checked)
                      }
                    >
                      {item.label}
                    </Checkbox>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </OptionsContainer>
  );

  return (
    <Dropdown
      overlay={content}
      trigger={["click"]}
      placement="bottomLeft"
      overlayStyle={{ minWidth: 240 }}
    >
      <Button icon={<FilterFilled />}>Filter</Button>
    </Dropdown>
  );
};
