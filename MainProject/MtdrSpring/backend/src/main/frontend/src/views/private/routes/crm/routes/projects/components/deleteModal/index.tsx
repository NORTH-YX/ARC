import { Modal } from "antd";
import styled from "styled-components";
import ImgArt from "../../../../../../../../assets/discovery-2.png";
import { Project } from "../../../../../../../../interfaces/project";

interface DeleteProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  project: Project | null;
  onDelete: (projectId: number) => void;
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
border-radius: 4px;
  `;

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  visible,
  onCancel,
  project,
  onDelete,
}) => {
  return (
    <StyledModal
      title=""
      visible={visible}
      okText="Delete"
      onOk={async () => {
        if (project) {
          onDelete(project.projectId);
        }
      }}
      onCancel={onCancel}
    >
      <img
        src={ImgArt}
        alt="Project Image"
        style={{
          width: "30%",
          height: "auto",
          marginTop: "10px",
          objectFit: "cover",
        }}
      />
      <h2 style={{ textAlign: "center", color: "#111827" }}>
        Are you sure you want to delete the project{" "}
        <strong style={{ fontWeight: "500" }}>{project?.projectName}</strong>?
      </h2>
      <p style={{ color: "#6B7280", textAlign: "center" }}>
        This action cannot be undone. Please confirm if you want to proceed.
      </p>
    </StyledModal>
  );
};
export default DeleteProjectModal;
