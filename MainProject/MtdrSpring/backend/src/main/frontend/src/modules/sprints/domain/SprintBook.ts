import { Sprint, SprintUpdate, SprintCreate } from "../../../interfaces/sprint";

import {
  createSprint,
  updateSprint,
  deleteSprint,
  restoreSprint,
} from "../../../api/sprint";

export default class SprintBook {
  private sprints: Sprint[];
  public injectable: any[];

  constructor(sprints: Sprint[]) {
    this.sprints = sprints || [];

    // Define which methods should be injectable into the store
    this.injectable = [
      this.createSprint,
      this.updateSprint,
      this.deleteSprint,
      this.restoreSprint,
      this.getSprintById,
      this.getSprintsByProjectId,
      this.getSprints,
    ];

    // Bind methods to maintain correct 'this' context
    this.createSprint = this.createSprint.bind(this);
    this.updateSprint = this.updateSprint.bind(this);
    this.deleteSprint = this.deleteSprint.bind(this);
    this.restoreSprint = this.restoreSprint.bind(this);
    this.getSprintById = this.getSprintById.bind(this);
    this.getSprintsByProjectId = this.getSprintsByProjectId.bind(this);
    this.getSprints = this.getSprints.bind(this);
  }
  getSprints(): Sprint[] {
    return this.sprints;
  }
  getSprintById(sprintId: number): Sprint | undefined {
    return this.sprints.find((sprint) => sprint.sprintId === sprintId);
  }
  getSprintsByProjectId(projectId: number): Sprint[] {
    return this.sprints.filter((sprint) => sprint.projectId === projectId);
  }
  async createSprint(sprintData: SprintCreate): Promise<Sprint> {
    const response = await createSprint(sprintData);
    this.sprints.push(response);
    return response;
  }
  async updateSprint(
    sprintId: number,
    sprintData: SprintUpdate
  ): Promise<Sprint> {
    const response = await updateSprint(sprintId, sprintData);
    const index = this.sprints.findIndex(
      (sprint) => sprint.sprintId === sprintId
    );
    if (index !== -1) {
      this.sprints[index] = response;
    }
    return response;
  }
  async deleteSprint(sprintId: number): Promise<void> {
    await deleteSprint(sprintId);
    this.sprints = this.sprints.filter(
      (sprint) => sprint.sprintId !== sprintId
    );
  }
  async restoreSprint(sprintId: number): Promise<void> {
    await restoreSprint(sprintId);
    const sprint = this.sprints.find((sprint) => sprint.sprintId === sprintId);
    if (sprint) {
      sprint.deletedAt = null;
    }
  }
}
