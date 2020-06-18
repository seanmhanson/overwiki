import { MongoClient, Db, Collection } from 'mongodb';
import HttpStatus from 'http-status-codes';

import { InsertOneResponse, FindOneResponse, DeleteResponse, CountResponse } from 'src/dao/types';

import ServerError from 'src/models/serverError';
import { DaoError, ErrorType } from 'src/models/serverErrorTypes';

interface DeleteOptions {
  query?: object;
  deleteMany?: boolean;
}

const DB_URI = 'mongodb://localhost:27030';
const DB_NAME = 'overwiki';

abstract class BaseDao {
  static client: MongoClient;
  static db: Db;

  private collection: Collection;
  private collectionName: string;
  private dbAndCollectionName: string;

  constructor(name: string) {
    this.collectionName = name;
  }

  public async init() {
    console.debug(`Instantiating ${this.collectionName} dao...`);

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
      this.collection = BaseDao.db.collection(this.collectionName);
      this.dbAndCollectionName = `${BaseDao.db.databaseName}.${this.collection.collectionName}`;
      console.debug('Database connection established successfully.');

      process.on('exit', (exitCode) => {
        if (BaseDao.client?.isConnected()) {
          BaseDao.client.close();
          console.debug(`Database connection closed with exit code ${exitCode}`);
        }
      });
    } catch {
      throw new ServerError(DaoError.CONNECTION_FAILED, { dbUri: DB_URI });
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
    try {
      const count = await this.collection.countDocuments();
      return {
        data: { count },
        statusCode: HttpStatus.OK,
      };
    } catch {
      throw this.getDaoError(DaoError.COUNT_ERROR);
    }
  }

  protected async insertOne(document: object): InsertOneResponse {
    try {
      const { insertedId } = await this.collection.insertOne(document);
      return { data: { insertedId }, statusCode: HttpStatus.CREATED };
    } catch {
      throw this.getDaoError(DaoError.INSERT_ERROR);
    }
  }

  protected async findOne(query: object): FindOneResponse {
    try {
      const data = await this.collection.findOne(query);
      if (data) {
        return { data, statusCode: HttpStatus.OK };
      }
      if (data === null) {
        return { data: null, statusCode: HttpStatus.NO_CONTENT };
      }
      throw this.getDaoError(DaoError.FIND_ERROR);
    } catch {
      throw this.getDaoError(DaoError.FIND_ERROR);
    }
  }

  protected deleteOne(query: object): DeleteResponse {
    return this.delete({ query });
  }

  private async delete({ query = {}, deleteMany = false }: DeleteOptions = {}): DeleteResponse {
    const command = deleteMany ? 'deleteMany' : 'deleteOne';

    try {
      const {
        result: { ok, n },
      } = await this.collection[command](query);
      if (!ok) {
        throw this.getDaoError(DaoError.DELETE_ERROR);
      }

      return {
        data: { n },
        statusCode: n ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      };
    } catch {
      throw this.getDaoError(DaoError.DELETE_ERROR);
    }
  }

  private getDaoError(errorType: ErrorType, statusCode = HttpStatus.INTERNAL_SERVER_ERROR) {
    return new ServerError(errorType, {
      dbAndCollectionName: this.dbAndCollectionName,
      statusCode,
    });
  }
}

export default BaseDao;
