import { ObjectId } from 'mongodb';

// subject
import { BaseDao } from 'dao';

// This extends the abstract class with a class used only
// in testing, which exposes all methods of the parent.
// As a heads-up, we should never expose abstract class methods
// directly, outside of testing the abstract class.
class TestBaseDao extends BaseDao {
  constructor() {
    super('test');
  }

  public _init = super.init;
  public _count = super.count;
  public _deleteAll = super.deleteAll;
  public _insertOne = super.insertOne;
  public _findOne = super.findOne;
  public _deleteOne = super.deleteOne;
}

const OBJECT_ID_REGEX = /^[A-Fa-f0-9]{24}$/;

describe('src/dao/baseDao.ts', () => {
  let dao: TestBaseDao;

  beforeAll(async () => {
    dao = new TestBaseDao();
    await dao._init();
  });

  afterAll(async () => {
    await BaseDao.disconnect();
  });

  afterEach(async () => {
    await dao._deleteAll();
  });

  describe('when inserting a document', () => {
    const existingId = new ObjectId();
    let expectedId: ObjectId;

    describe('and the document does not include an _id field', () => {
      beforeEach(async () => {
        const {
          data: { insertedId },
        } = await dao._insertOne({ a: 1 });
        expectedId = insertedId;
      });

      it('returns a created id', () => {
        expect(expectedId.toString()).toMatch(OBJECT_ID_REGEX);
      });
    });

    describe('and the document already includes an _id field', () => {
      beforeEach(async () => {
        const {
          data: { insertedId },
        } = await dao._insertOne({ a: 1, _id: existingId });
        expectedId = insertedId;
      });

      it('returns an objectId corresponding to the provided _id', () => {
        expect(expectedId).toEqual(existingId);
      });
    });
  });

  describe('when querying for a document', () => {
    const expectedDocument = { a: 1, _id: 1 };
    let document: object;

    describe('and the document exists', () => {
      beforeEach(async () => {
        await dao._insertOne(expectedDocument);
        await dao._insertOne({ b: 2, _id: 2 });
        await dao._insertOne({ c: 3, _id: 3 });

        const { data } = await dao._findOne({
          a: { $exists: true },
        });
        document = data;
      });

      it('an appropriate query returns the document', () => {
        expect(document).toEqual(expectedDocument);
      });
    });

    describe('and the document does not exist', () => {
      beforeEach(async () => {
        const { data } = await dao._findOne({
          a: { $exists: true },
        });
        document = data;
      });

      it('the appropriate query does not return a document', () => {
        expect(document).toBeNull();
      });
    });
  });

  describe('when deleting a document', () => {
    let documentId: ObjectId;
    let initialCount: number;
    let numberDeleted: number;

    describe('when first inserting a document', () => {
      beforeEach(async () => {
        const {
          data: { insertedId },
        } = await dao._insertOne({ a: 1 });
        const {
          data: { count },
        } = await dao._count();
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
          } = await dao._deleteOne({ _id: documentId });
          numberDeleted = n;
        });

        it('returns that one document was deleted', () => {
          expect(numberDeleted).toEqual(1);
        });

        it('indicates the correct document count', async () => {
          const {
            data: { count },
          } = await dao._count();
          expect(count).toEqual(initialCount - 1);
        });
      });

      describe('when the query does not match any document', () => {
        beforeEach(async () => {
          const {
            data: { n },
          } = await dao._deleteOne({ _id: 0 });
          numberDeleted = n;
        });

        it('returns that no documents were deleted', () => {
          expect(numberDeleted).toEqual(0);
        });

        it('indicates the document count remains unchanged', async () => {
          const {
            data: { count },
          } = await dao._count();
          expect(count).toEqual(initialCount);
        });
      });
    });
  });

  describe('when deleting all documents in a collection', () => {
    let initialCount: number;

    describe('when first insertings documents', () => {
      beforeEach(async () => {
        await dao._insertOne({ a: 1 });
        await dao._insertOne({ b: 2 });
        await dao._insertOne({ c: 3 });
        const {
          data: { count },
        } = await dao._count();
        initialCount = count;
      });

      it('returns the correct count for the collection', () => {
        expect(initialCount).toEqual(3);
      });

      describe('when deleting all documents', () => {
        beforeEach(async () => {
          await dao._deleteAll();
        });

        it('returns a count of zero for the collection', async () => {
          const {
            data: { count },
          } = await dao._count();
          expect(count).toEqual(0);
        });
      });
    });
  });
});
