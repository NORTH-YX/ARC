import styled from "styled-components";
import { Table, Button } from "antd";

const StyledTable = styled(Table)`
 background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  padding: 0px;

  .ant-table-thead > tr > th {
    color: #6b7280;
    padding: 0px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
  }
`;

const StyledButton = styled(Button)`
  && {
    border: none;
    background-color: transparent;
    box-shadow: none;
    color: inherit;
    padding: 0;
  }

  &&:hover,
  &&:focus,
  &&:active {
    border: none;
    background-color: transparent;
    box-shadow: none;
    color: inherit;
  }
`;

export { StyledTable, StyledButton }