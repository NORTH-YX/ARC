import React from "react";
import {
  Container,
  Title,
  DetailRow,
  Label,
  Value,
  ProfileImage,
  ProfileContainer,
  IconWrapper,
} from "./elements";
import { CheckCircleFilled, PlusCircleFilled } from "@ant-design/icons";

interface Detail {
  label?: string;
  value: string;
  image?: string;
  alt?: string;
  secondValue?: string;
  type?: string;
}

interface Section {
  title: string;
  rows: Detail[];
}

const projectData: Section[] = [
  {
    title: "Project Details",
    rows: [
      { label: "Start Date", value: "Feb 1, 2025" },
      { label: "End Date", value: "Apr 30, 2025" },
      {
        label: "Project Lead",
        value: "David Beltran",
        image: "https://via.placeholder.com/32",
        alt: "DB",
      },
    ],
  },
  {
    title: "Team Members",
    rows: [
      {
        value: "Alejandro Barrera",
        label: "UI Designer",
        image: "https://via.placeholder.com/32",
        alt: "AB",
      },
      {
        value: "Ana Paula Figueroa",
        label: "Frontend Dev",
        image: "https://via.placeholder.com/32",
        alt: "AF",
      },
      {
        value: "Gerardo Garcia",
        label: "Backend Dev",
        image: "https://via.placeholder.com/32",
        alt: "GG",
      },
      {
        value: "De Jesus Santos",
        label: "AI Engineer",
        image: "https://via.placeholder.com/32",
        alt: "DJS",
      },
    ],
  },
  {
    title: "Recent Activity",
    rows: [
      {
        type: "Completed",
        value: "Task completed: Homepage Design",
        secondValue: "2 hours ago",
      },
      {
        type: "New",
        value: "New task added to Sprint 2",
        secondValue: "4 hours ago",
      },
    ],
  },
];

const getIconForType = (type: string) => {
  switch (type) {
    case "Completed":
      return (
        <IconWrapper bgColor="#DBEAFE">
          <CheckCircleFilled style={{ color: "#2563EB", fontSize: "18px" }} />
        </IconWrapper>
      );
    case "New":
      return (
        <IconWrapper bgColor="#D1FAE5">
          <PlusCircleFilled style={{ color: "#059669", fontSize: "18px" }} />
        </IconWrapper>
      );
    default:
      return null;
  }
};

const ProjectDetail: React.FC = () => {
  return (
    <Container>
      {projectData.map((section, sectionIndex) => (
        <React.Fragment key={sectionIndex}>
          <Title>{section.title}</Title>
          {section.rows.map((row, rowIndex) => (
            <DetailRow key={rowIndex}>
              {row.label && !row.image && <Label>{row.label}</Label>}
              {row.image ? (
                <ProfileContainer>
                  <ProfileImage src={row.image} alt={row.alt || row.value} />
                  <DetailRow>
                    <Value>{row.value}</Value>
                    {row.label && <Label>{row.label}</Label>}
                  </DetailRow>
                </ProfileContainer>
              ) : (
                <>
                  <ProfileContainer>
                    {row.type && getIconForType(row.type)}
                    <DetailRow>
                      <Value>{row.value}</Value>
                      {row.secondValue && <Label>{row.secondValue}</Label>}
                    </DetailRow>
                  </ProfileContainer>
                </>
              )}
            </DetailRow>
          ))}
        </React.Fragment>
      ))}
    </Container>
  );
};

export default ProjectDetail;
