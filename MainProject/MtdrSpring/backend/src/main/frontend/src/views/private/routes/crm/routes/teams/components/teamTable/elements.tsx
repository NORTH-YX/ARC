import styled from "styled-components";
import { Table, Segmented } from "antd";

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

const StyledSegmented = styled(Segmented)`
  .ant-segmented-item {
    color: #374151; /* Tailwind gray-700 */
    font-weight: 500;
    padding: 4px 6px;
    transition: background-color 0.3s, color 0.3s;
  }

  .ant-segmented-item-selected {
    background-color: #C74634; /* Red button like in your image */
    color: white;
  }

    .ant-segmented-thumb {
    color: #C74634; /* Removes the default sliding thumb */
  }

`;


export { StyledTable, StyledSegmented }