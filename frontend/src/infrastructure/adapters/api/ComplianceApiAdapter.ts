// frontend/src/infrastructure/adapters/api/ComplianceApiAdapter.ts
import axios from 'axios';

const rootClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 8000,
});

export class ComplianceApiAdapter {
  async getCb(shipId: string, year: number) {
    const { data } = await rootClient.get('/compliance/cb', {
      params: { shipId, year },
    });
    return data; // { shipId, year, cbGco2eq }
  }

  async getAdjustedCb(shipId: string, year: number) {
    const { data } = await rootClient.get('/compliance/adjusted-cb', {
      params: { shipId, year },
    });
    return data; // { shipId, year, adjustedCb }
  }

  async getBanked(shipId: string, year: number) {
    const { data } = await rootClient.get('/banking/records', {
      params: { shipId, year },
    });
    return data; // { shipId, year, amount }
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    const { data } = await rootClient.post('/banking/bank', { shipId, year, amount });
    return data;
  }

  async applyBank(shipId: string, year: number, amount: number) {
    const { data } = await rootClient.post('/banking/apply', { shipId, year, amount });
    return data;
  }

  async createPool(year: number) {
    const { data } = await rootClient.post('/pools', { year });
    return data; // { poolId }
  }

  async allocatePool(poolId: string) {
    const { data } = await rootClient.post('/pools/allocate', { poolId });
    return data; // allocation results
  }
}
