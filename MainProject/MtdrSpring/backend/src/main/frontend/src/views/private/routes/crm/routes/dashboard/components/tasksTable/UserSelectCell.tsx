import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { UserSelect } from './styles';
import { Task } from '../../../../../../../../interfaces/task/index';
import { User } from '../../../../../../../../interfaces/user/index';

interface UserSelectCellProps {
  record: Task;
  users: User[];
  onUserChange: (newUserId: number, task: Task) => void;
}

const UserSelectCell: React.FC<UserSelectCellProps> = ({
  record,
  users,
  onUserChange
}) => {
  return (
    <div style={{ width: '130px' }}>
      <UserSelect
        value={record.user?.userId}
        style={{ width: '100%' }}
        onChange={(value) => onUserChange(Number(value), record)}
        options={users.map((user) => ({
          value: user.userId,
          label: user.name,
        }))}
        className="user-select"
        popupClassName="user-select-dropdown"
        dropdownStyle={{ zIndex: 1100 }}
        placeholder="Assign user"
        suffixIcon={<UserOutlined />}
        showSearch
        optionFilterProp="label"
      />
    </div>
  );
};

export default UserSelectCell; 