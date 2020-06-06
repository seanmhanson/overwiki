import User, { ConstructorProps } from 'src/models/user';
import UserDao from 'src/dao/userDao';
import { InsertOneData, FindOneData, DeleteData } from 'src/dao/types';

export default class UserSvc {
  private dao: UserDao;

  async init() {
    this.dao = new UserDao();
    await this.dao.init();
  }

  async create({ username, password }: ConstructorProps): Promise<InsertOneData> {
    // find if a user matching the username exists
    const existingUser = await this.dao.findByUsername(username);
    if (existingUser) {
      throw new Error('A user with the same username already exists.');
    }

    // TODO: ensure password is secure

    // create new user
    const user = new User({ username, password });
    const response = await this.dao.create(user);
    return response;
  }

  findByUsername({ username }: { username: string }): Promise<FindOneData> {
    return this.dao.findByUsername(username);
  }

  deleteByUsername({ username }: { username: string }): Promise<DeleteData> {
    return this.dao.deleteByUsername(username);
  }
}
