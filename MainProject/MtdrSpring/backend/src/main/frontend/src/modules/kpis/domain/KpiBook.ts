import { Kpis } from "./types";

export default class KpiBook {
  private kpis: Kpis;
  public injectable: any[];

  constructor(kpis: Kpis) {
    this.kpis = kpis;

    // Define which methods should be injectable into the store
    this.injectable = [
      this.getKpis,
      this.getProjectKpis,
      this.getSprintKpis,
      this.getUserKpis,
      this.getComplianceRate,
      this.getEstimationPrecision
    ];

    // Bind methods to maintain correct 'this' context
    this.getKpis = this.getKpis.bind(this);
    this.getProjectKpis = this.getProjectKpis.bind(this);
    this.getSprintKpis = this.getSprintKpis.bind(this);
    this.getUserKpis = this.getUserKpis.bind(this);
    this.getComplianceRate = this.getComplianceRate.bind(this);
    this.getEstimationPrecision = this.getEstimationPrecision.bind(this);
  }

  getKpis(): Kpis {
    return this.kpis;
  }

  getProjectKpis() {
    return {
      compliance: this.kpis.compliance_rate.projects,
      estimation: this.kpis.estimation_precision.projects
    };
  }

  getSprintKpis() {
    return {
      compliance: this.kpis.compliance_rate.sprints,
      estimation: this.kpis.estimation_precision.sprints
    };
  }

  getUserKpis() {
    return {
      compliance: this.kpis.compliance_rate.users,
      estimation: this.kpis.estimation_precision.users
    };
  }

  getComplianceRate() {
    return this.kpis.compliance_rate;
  }

  getEstimationPrecision() {
    return this.kpis.estimation_precision;
  }
} 