import { ObjectId } from 'mongodb';

export interface ConstructorProps {
  username: string;
  password: string;
}

export default class User {
  _id: ObjectId;
  username: string;
  password: string;
  #verified: boolean;
  #createdDate: number;
  #updatedDate: number;

  constructor({ username, password }: ConstructorProps) {
    const now = Date.now();
    this._id = new ObjectId();
    this.username = username;
    this.password = password;
    this.#verified = false;
    this.#createdDate = now;
    this.#updatedDate = now;
  }
}
