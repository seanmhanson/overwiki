import HttpStatus from 'http-status-codes';
import { ObjectId } from 'mongodb';

// subject
import BaseDao from 'src/dao/baseDao';

class TestBaseDao extends BaseDao {
  static collectionName = 'test';

  constructor() {
    super(TestBaseDao.collectionName);
  }

  public testInsertOne(document: object) {
    return super.insertOne(document);
  }

  public testFindOne(query: object) {
    return super.findOne(query);
  }

  public testDeleteOne(query: object) {
    return super.deleteOne(query);
  }

  public testCount() {
    return super.count();
  }
}

const OBJECT_ID_REGEX = /^[A-Fa-f0-9]{24}$/;

describe('src/dao/baseDao.ts', () => {
  let dao: TestBaseDao;

  beforeAll(async () => {
    dao = new TestBaseDao();
    await dao.init();
  });

  afterAll(async () => {
    await TestBaseDao.disconnect();
  });

  afterEach(async () => {
    await dao.deleteAll();
  });

  describe('when inserting a document', () => {
    const existingId = new ObjectId();
    let expectedId: ObjectId;
    let status: number;

    describe('and the document does not include an _id field', () => {
      beforeEach(async () => {
        const {
          data: { insertedId },
          statusCode,
        } = await dao.testInsertOne({ a: 1 });
        expectedId = insertedId;
        status = statusCode;
      });

      it('returns a created id', () => {
        expect(expectedId.toString()).toMatch(OBJECT_ID_REGEX);
      });

      it('returns a created http response', () => {
        expect(status).toEqual(HttpStatus.CREATED);
      });
    });

    describe('and the document already includes an _id field', () => {
      beforeEach(async () => {
        const {
          data: { insertedId },
          statusCode,
        } = await dao.testInsertOne({ a: 1, _id: existingId });
        expectedId = insertedId;
        status = statusCode;
      });

      it('returns an objectId corresponding to the provided _id', () => {
        expect(expectedId).toEqual(existingId);
      });

      it('returns a created http response', () => {
        expect(status).toEqual(HttpStatus.CREATED);
      });
    });
  });

  describe('when querying for a document', () => {
    const expectedDocument = { a: 1, _id: 1 };
    let status: number;
    let document: object;

    describe('and the document exists', () => {
      beforeEach(async () => {
        await dao.testInsertOne(expectedDocument);
        await dao.testInsertOne({ b: 2, _id: 2 });
        await dao.testInsertOne({ c: 3, _id: 3 });

        const { data, statusCode } = await dao.testFindOne({
          a: { $exists: true },
        });
        document = data;
        status = statusCode;
      });

      it('an appropriate query returns the document', () => {
        expect(document).toEqual(expectedDocument);
      });

      it('returns an OK http response', () => {
        expect(status).toEqual(HttpStatus.OK);
      });
    });

    describe('and the document does not exist', () => {
      beforeEach(async () => {
        const { data, statusCode } = await dao.testFindOne({
          a: { $exists: true },
        });
        document = data;
        status = statusCode;
      });

      it('the appropriate query does not return a document', () => {
        expect(document).toBeNull();
      });

      it('returns a no content http response', () => {
        expect(status).toEqual(HttpStatus.NO_CONTENT);
      });
    });
  });

  describe('when deleting a document', () => {
    let documentId: ObjectId;
    let initialCount: number;
    let numberDeleted: number;
    let status: number;

    describe('when first inserting a document', () => {
      beforeEach(async () => {
        const {
          data: { insertedId },
        } = await dao.testInsertOne({ a: 1 });
        const {
          data: { count },
        } = await dao.testCount();
        documentId = insertedId;
        initialCount = count;
      });

      it('correctly indicates the count', () => {
        expect(initialCount).toEqual(1);
      });

      describe('when the document is deleted', () => {
        beforeEach(async () => {
          const {
            data: { n },
            statusCode,
          } = await dao.testDeleteOne({ _id: documentId });
          status = statusCode;
          numberDeleted = n;
        });

        it('returns that one document was deleted', () => {
          expect(numberDeleted).toEqual(1);
        });

        it('returns a success http response', () => {
          expect(status).toEqual(HttpStatus.OK);
        });

        it('indicates the correct document count', async () => {
          const {
            data: { count },
          } = await dao.testCount();
          expect(count).toEqual(initialCount - 1);
        });
      });

      describe('when the query does not match any document', () => {
        beforeEach(async () => {
          const {
            data: { n },
            statusCode,
          } = await dao.testDeleteOne({ _id: 0 });
          status = statusCode;
          numberDeleted = n;
        });

        it('returns that no documents were deleted', () => {
          expect(numberDeleted).toEqual(0);
        });

        it('returns a not found http response', () => {
          expect(status).toEqual(HttpStatus.NOT_FOUND);
        });

        it('indicates the document count remains unchanged', async () => {
          const {
            data: { count },
          } = await dao.testCount();
          expect(count).toEqual(initialCount);
        });
      });
    });
  });

  describe('when deleting all documents in a collection', () => {
    let initialCount: number;

    describe('when first insertings documents', () => {
      beforeEach(async () => {
        await dao.testInsertOne({ a: 1 });
        await dao.testInsertOne({ b: 2 });
        await dao.testInsertOne({ c: 3 });
        const {
          data: { count },
        } = await dao.testCount();
        initialCount = count;
      });

      it('returns the correct count for the collection', () => {
        expect(initialCount).toEqual(3);
      });

      describe('when deleting all documents', () => {
        beforeEach(async () => {
          await dao.deleteAll();
        });

        it('returns a count of zero for the collection', async () => {
          const {
            data: { count },
          } = await dao.testCount();
          expect(count).toEqual(0);
        });
      });
    });
  });
});
