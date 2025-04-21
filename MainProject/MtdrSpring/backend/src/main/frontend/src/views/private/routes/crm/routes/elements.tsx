import styled from "styled-components";
import { Tag } from "antd";

export const ResponsiveTag = styled(Tag)`
  border-radius: 4px;
  border: none;
  padding: 5px 14px;
  height: fit-content;

  @media (max-width: 600px) {
    display: none;
  }
`;
