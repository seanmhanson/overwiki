import BaseDao from 'src/dao/baseDao';
import User from 'src/models/user';

import {
  InsertOneData,
  FindOneData,
  DeleteData,
  CountData,
} from 'src/dao/types';

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

  public async countUsers(): Promise<CountData> {
    const {
      data: { count },
    } = await super.count();
    return { count };
  }
}
