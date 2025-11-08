// backend/src/core/domain/entities/Compliance.ts

export interface Compliance {
  shipId: string;
  year: number;
  cbGco2eq: number;
  surplus?: number;
}
