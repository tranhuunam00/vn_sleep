/* eslint-disable */
import { Cat } from '../interfaces/cat.interface';

export class MockCatsService {
  async create() {}
  async findAll() {
    console.log("[MockCatsService] findALl");
    return `MockCatsService findALl`
  }
}
