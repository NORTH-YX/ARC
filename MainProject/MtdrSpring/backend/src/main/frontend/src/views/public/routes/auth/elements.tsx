import styled from "styled-components";
import { Typography } from "antd";

const { Link } = Typography;

const StyledLink = styled(Link)`
  && {
    color: #c74634;
  }
`;

const StyledImage = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

export { StyledLink, StyledImage };