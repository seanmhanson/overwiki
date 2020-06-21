import { ObjectId } from 'mongodb';

export type InsertOneData = { insertedId: ObjectId };
export type FindOneData = { [key: string]: any } | null;
export type DeleteData = { n: number };
export type CountData = { count: number };
type StatusCode = number;

interface BaseDaoSuccess<T> {
  data: T;
  error?: never;
  statusCode: StatusCode;
}

export interface BaseDaoError {
  data?: never;
  error: Error;
  statusCode: StatusCode;
}

type BaseDaoInterface<T> = BaseDaoSuccess<T> | BaseDaoError;

// response interfaces
type InsertOneInterface = BaseDaoInterface<InsertOneData>;
type FindOneInterface = BaseDaoInterface<FindOneData>;
type DeleteInterface = BaseDaoInterface<DeleteData>;
type CountInterface = BaseDaoInterface<CountData>;

// base dao response types
export type InsertOneResponse = Promise<InsertOneInterface>;
export type FindOneResponse = Promise<FindOneInterface>;
export type DeleteResponse = Promise<DeleteInterface>;
export type CountResponse = Promise<CountInterface>;
