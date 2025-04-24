import styled from "styled-components";
import { Card, Button } from "antd";

const StyledCard = styled(Card)`
    width: 100%;
    height: 252px;

    .ant-card-body {
    padding-bottom: 0; /* Remove the default bottom padding */
    padding-top: 0;
    height: 100%; /* Optional: ensures content uses full height */
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Optional: better layout control */
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


export { StyledCard, StyledButton };