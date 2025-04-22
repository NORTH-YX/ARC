import styled from 'styled-components';
import { Table, Select } from 'antd';

export const StyledTable = styled(Table)`
  width: 100%;
  
  .ant-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    background: #f5f5f5;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f0f0f0;
  }

  .ant-table-column-group-title {
    background: white;
    padding: 16px;
    width: 100%;
  }
  
  .ant-table-column-group {
    width: 100%;
  }
  
  .editable-cell {
    padding: 0 !important;
  }
`;

export const StatusSelect = styled(Select)`
  &.status-select .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
  }
  
  &.status-select-to-do .ant-select-selector {
    background-color: #DBEAFE !important;
  }
  
  &.status-select-in-progress .ant-select-selector {
    background-color: #FEF3C7 !important;
  }
  
  &.status-select-completed .ant-select-selector {
    background-color: #D1FAE5 !important;
  }
  
  &.status-select-blocked .ant-select-selector {
    background-color: #FEE2E2 !important;
  }
  
  .ant-select-dropdown.status-select-dropdown .ant-select-item-option-selected {
    background-color: #F3F4F6 !important;
  }
  
  .ant-select-dropdown.status-select-dropdown .ant-select-item-option:hover {
    background-color: #F9FAFB !important;
  }
`;

export const UserSelect = styled(Select)`
  &.user-select .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
    background-color: #f0f0f0 !important;
  }
  
  &.user-select:hover .ant-select-selector {
    background-color: #e6e6e6 !important;
  }
  
  .ant-select-dropdown.user-select-dropdown .ant-select-item-option-selected {
    background-color: #F3F4F6 !important;
  }
  
  .ant-select-dropdown.user-select-dropdown .ant-select-item-option:hover {
    background-color: #F9FAFB !important;
  }
`;

export const DateCellContent = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
    cursor: pointer;
  }
  
  .edit-icon {
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  &:hover .edit-icon {
    opacity: 0.6;
  }
`;

export const StyledDatePicker = styled.div`
  .custom-date-picker .ant-picker-input > input::placeholder {
    color: #bbb;
  }
  
  .custom-date-picker .ant-picker-separator {
    color: #aaa;
  }
  
  .custom-date-picker {
    border-color: #e0e0e0;
  }
  
  .custom-date-picker:hover {
    border-color: #4096ff;
  }
  
  .custom-date-picker .ant-picker-suffix {
    color: #aaa;
  }
  
  .date-picker-popover .ant-picker {
    margin-bottom: 0;
  }
  
  .date-picker-popover .ant-popover-inner-content {
    padding: 0;
  }
`;

export const TableHeader = styled.div`
  padding: 16px;
  border-radius: 8px 8px 0 0;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: -1px;
`;

export const SearchBar = styled.div`
  padding: 10px 16px;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`; 