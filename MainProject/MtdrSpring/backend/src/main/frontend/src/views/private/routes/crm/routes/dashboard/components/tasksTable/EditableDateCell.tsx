import React from 'react';
import { Typography, DatePicker, Popover } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { DateCellContent } from './styles';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { Task } from '../../../../../../../../interfaces/task/index';
import { formatReadableDate } from '../../../utils.tsx';

const { Text } = Typography;

interface EditableDateCellProps {
  value: string | null;
  record: Task;
  field: string;
  isEditing: boolean;
  onEdit: (taskId: number, field: string) => void;
  onDateChange: (date: Dayjs | null, field: string, taskId: number) => void;
  onClosePopover: () => void;
}

const EditableDateCell: React.FC<EditableDateCellProps> = ({
  value,
  record,
  field,
  isEditing,
  onEdit,
  onDateChange,
  onClosePopover
}) => {
  const datePicker = (
    <DatePicker
      showTime
      format="MMM D, YYYY h:mm a"
      defaultValue={value ? dayjs(value) : null}
      style={{ width: '240px' }}
      onOk={(date) => onDateChange(date, field, record.taskId)}
      open={true}
      autoFocus
    />
  );

  return (
    <Popover
      content={datePicker}
      trigger="click"
      open={isEditing}
      onOpenChange={(open) => {
        if (!open) {
          onClosePopover();
        }
      }}
      overlayClassName="date-picker-popover"
      overlayStyle={{ zIndex: 1100 }}
      destroyTooltipOnHide
    >
      <DateCellContent
        onClick={() => onEdit(record.taskId, field)}
      >
        <Text>{value ? formatReadableDate(value) : field === "realFinishDate" ? "Not Finished" : "Not Set"}</Text>
        <EditOutlined className="edit-icon" style={{ fontSize: '12px' }} />
      </DateCellContent>
    </Popover>
  );
};

export default EditableDateCell; 