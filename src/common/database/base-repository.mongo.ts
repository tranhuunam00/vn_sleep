import { BaseQueryMongoPayload } from './mongo/base-query.mongo';

export type BaseQueryPayload = BaseQueryMongoPayload;

export interface BaseRepository<T> {
  create(entity: T): Promise<T>;
  update(entity: Partial<T>, payload?: BaseQueryPayload): Promise<T>;
  find(payload?: BaseQueryPayload): Promise<T[]>;
  findById(id: string | number): Promise<T | undefined>;
  findOne(payload?: BaseQueryPayload): Promise<T | undefined>;
  delete(entity: T): Promise<T>;
  getNewId(): Promise<string>;
}
