import React from "react";
import {
  FolderOpenFilled,
  CheckOutlined,
  ClockCircleFilled,
  FireFilled,
} from "@ant-design/icons";
import { IconWrapper } from "../../../projects/elements";
import {
  StyledCard,
  RowContainer,
  ColumnContainer,
  IndicatorsContainer,
  Value,
} from "./elements";

const Indicators: React.FC = () => {
  return (
    <IndicatorsContainer>
      <StyledCard>
        <RowContainer>
          <IconWrapper $bgColor="#ffe5e5">
            <FireFilled style={{ color: "#C74634", fontSize: "20px" }} />
          </IconWrapper>
          <ColumnContainer>
            <p style={{ margin: 0 }}>Active Sprints</p>
            <Value color="#C74634">3</Value>
          </ColumnContainer>
        </RowContainer>
      </StyledCard>

      <StyledCard>
        <RowContainer>
          <IconWrapper $bgColor="#EDE9FE">
            <FolderOpenFilled style={{ color: "#7C3AED", fontSize: "20px" }} />
          </IconWrapper>
          <ColumnContainer>
            <p style={{ margin: 0 }}>Total Tasks</p>
            <Value color="#7C3AED">24</Value>
          </ColumnContainer>
        </RowContainer>
      </StyledCard>

      <StyledCard>
        <RowContainer>
          <IconWrapper $bgColor="#D1FAE5">
            <CheckOutlined style={{ color: "#059669", fontSize: "20px" }} />
          </IconWrapper>
          <ColumnContainer>
            <p style={{ margin: 0 }}>Completed</p>
            <Value color="#059669">12</Value>
          </ColumnContainer>
        </RowContainer>
      </StyledCard>

      <StyledCard>
        <RowContainer>
          <IconWrapper $bgColor="#FEF3C7">
            <ClockCircleFilled style={{ color: "#D97706", fontSize: "20px" }} />
          </IconWrapper>
          <ColumnContainer>
            <p style={{ margin: 0 }}>In Progress</p>
            <Value color="#D97706">8</Value>
          </ColumnContainer>
        </RowContainer>
      </StyledCard>
    </IndicatorsContainer>
  );
};

export default Indicators;
