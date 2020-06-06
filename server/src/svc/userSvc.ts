import User from 'src/models/user';
import UserDao from 'src/dao/userDao';
import { InsertOneData, FindOneData, DeleteData } from 'src/dao/types';
import HashedPassword from 'src/models/hashedPassword';

interface CreateUserProps {
  username: string;
  password: string;
}

export default class UserSvc {
  private dao: UserDao;

  async init() {
    this.dao = new UserDao();
    await this.dao.init();
  }

  async create({ username, password }: CreateUserProps): Promise<InsertOneData> {
    const existingUser = await this.dao.findByUsername(username);
    if (existingUser) {
      throw new Error('A user with the same username already exists.');
    }

    const hashedPassword = new HashedPassword();
    await hashedPassword.setPassword(password);

    const user = new User({ username, password: hashedPassword });
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
