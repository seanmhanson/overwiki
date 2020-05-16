import { MongoClient, Db, Collection } from 'mongodb';
import HttpStatus from 'http-status-codes';

import {
  InsertOneResponse,
  FindOneResponse,
  DeleteResponse,
  CountResponse,
  BaseDaoError,
} from 'src/dao/types';

interface DeleteOptions {
  query?: object;
  deleteMany?: boolean;
}

enum Operation {
  Find = 'finding',
  Insert = 'inserting',
  Delete = 'deleting',
  Update = 'updating',
}

const DB_URI = 'mongodb://localhost:27030';
const DB_NAME = 'overwiki';

abstract class BaseDao {
  static client: MongoClient;
  static db: Db;

  #collection: Collection;
  #collectionName: string;
  #dbAndCollectionName: string;

  constructor(name: string) {
    this.#collectionName = name;
  }

  public async init() {
    console.debug(`Instantiating ${this.#collectionName} dao...`);

    if (BaseDao.db) {
      console.debug('Using pre-existing connection.');
      return;
    }

    try {
      console.debug('Establishing database connection...');
      BaseDao.client = await MongoClient.connect(DB_URI, {
        useUnifiedTopology: true,
      });
      BaseDao.db = BaseDao.client.db(DB_NAME);
      this.#collection = BaseDao.db.collection(this.#collectionName);
      this.#dbAndCollectionName = `${BaseDao.db.databaseName}.${
        this.#collection.collectionName
      }`;
      console.debug('Database connection established successfully.');

      process.on('exit', (exitCode) => {
        if (BaseDao.client?.isConnected()) {
          BaseDao.client.close();
          console.debug(
            `Database connection closed with exit code ${exitCode}`
          );
        }
      });
    } catch (err) {
      console.error(`Error connecting to database at: ${DB_URI}`);
      throw err;
    }
  }

  public static async disconnect() {
    if (BaseDao.client?.isConnected()) {
      await BaseDao.client.close();
      console.debug('Database connection closed.');
      return;
    }
    console.debug('No database connection exists.');
  }

  public deleteAll(): DeleteResponse {
    return this.delete({ deleteMany: true });
  }

  protected async count(): CountResponse {
    const count = await this.#collection.count();
    return {
      data: { count },
      statusCode: HttpStatus.OK,
    };
  }

  protected async insertOne(document: object): InsertOneResponse {
    const operation = Operation.Insert;

    try {
      const { insertedId } = await this.#collection.insertOne(document);
      return { data: { insertedId }, statusCode: HttpStatus.CREATED };
    } catch (err) {
      return this.logError(err, operation);
    }
  }

  protected async findOne(query: object): FindOneResponse {
    const operation = Operation.Find;

    try {
      const data = await this.#collection.findOne(query);
      if (data) {
        return { data, statusCode: HttpStatus.OK };
      }
      if (data === null) {
        return { data: null, statusCode: HttpStatus.NO_CONTENT };
      }
      return this.logError(new Error(), operation);
    } catch (err) {
      return this.logError(err, operation);
    }
  }

  protected deleteOne(query: object): DeleteResponse {
    return this.delete({ query });
  }

  private async delete({
    query = {},
    deleteMany = false,
  }: DeleteOptions = {}): DeleteResponse {
    const operation = Operation.Delete;
    const command = deleteMany ? 'deleteMany' : 'deleteOne';

    try {
      const {
        result: { ok, n },
      } = await this.#collection[command](query);
      if (!ok) {
        return this.logError(new Error(), operation);
      }

      return {
        data: { n },
        statusCode: n ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      };
    } catch (err) {
      return this.logError(err, operation);
    }
  }

  private logError(error: Error, operation: Operation): BaseDaoError {
    console.error(
      `Error ${operation.toString()} ` +
        `document in ${this.#dbAndCollectionName}`
    );
    return {
      error,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}

export default BaseDao;
