import styled from "styled-components";
import { Table, Button, Progress, Input } from "antd";

const { Search } = Input;

const Hearder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    grid-gap: 10px;

    & > :nth-child(2) {
      justify-self: end;
    }

    & > :nth-child(3) {
      grid-column: 1 / span 2;
    }
  }
`;

const StytledSearchDesktop = styled(Search)`
  @media (max-width: 600px) {
    display: none;
  }
`;
const StytledSearchMobile = styled(Search)`
  @media (min-width: 600px) {
    display: none;
  }
`;

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

const StyledProgress = styled(Progress)``;

export {
  StyledTable,
  StyledButton,
  StyledProgress,
  Hearder,
  StytledSearchDesktop,
  StytledSearchMobile,
};
