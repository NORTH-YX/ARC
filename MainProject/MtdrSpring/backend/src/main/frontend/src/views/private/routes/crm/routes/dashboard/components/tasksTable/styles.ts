import styled from 'styled-components';
import { Table } from 'antd';

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
`; 