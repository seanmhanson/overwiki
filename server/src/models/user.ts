import { ObjectId } from 'mongodb';

import HashedPassword from './hashedPassword';

export interface ConstructorProps {
  username: string;
  password: HashedPassword;
}

export default class User {
  _id: ObjectId;
  username: string;
  password: HashedPassword;
  private verified: boolean;
  private createdDate: number;
  private updatedDate: number;

  constructor({ username, password }: ConstructorProps) {
    const now = Date.now();
    this._id = new ObjectId();
    this.username = username;
    this.password = password;
    this.verified = false;
    this.createdDate = now;
    this.updatedDate = now;
  }
}
