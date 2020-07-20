import { User } from 'models';
import BaseDao from './baseDao';
import { InsertOneData, FindOneData, DeleteData, CountData } from './types';

export default class UserDao extends BaseDao {
  static collectionName = 'users';

  constructor() {
    super(UserDao.collectionName);
  }

  public async create(user: User): Promise<InsertOneData> {
    const { data } = await super.insertOne(user);
    return data;
  }

  public async findByUsername(username: string): Promise<FindOneData> {
    const { data } = await super.findOne({ username });
    return data;
  }

  public async deleteByUsername(username: string): Promise<DeleteData> {
    const { data } = await super.deleteOne({ username });
    return data;
  }

  public async deleteAllUsers(): Promise<DeleteData> {
    const { data } = await super.deleteAll();
    return data;
  }

  public async countUsers(): Promise<CountData> {
    const {
      data: { count },
    } = await super.count();
    return { count };
  }
}
