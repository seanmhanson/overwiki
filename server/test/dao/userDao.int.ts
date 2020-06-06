import { ObjectId } from 'mongodb';

// model and fixtures
import User from 'src/models/user';
import userDaoFixtures from 'test/fixtures/userDaoFixtures';

// subject
import UserDao from 'src/dao/userDao';
import HashedPassword from 'src/models/hashedPassword';

describe('src/dao/userDao.ts', () => {
  let dao: UserDao;

  beforeAll(async () => {
    dao = new UserDao();
    await dao.init();
  });

  afterAll(async () => {
    await UserDao.disconnect();
  });

  beforeEach(() => {
    userDaoFixtures.forEach((user) => {
      dao.create(user);
    });
  });

  afterEach(async () => {
    await dao.deleteAll();
  });

  describe('when creating a new user', () => {
    let initialCount: number;
    let returnedId: ObjectId;
    let expectedId: ObjectId;

    beforeEach(async () => {
      const password = new HashedPassword();
      password.setPassword('eyeLikeZelda');
      const newUser = new User({
        username: 'link@hylia.com',
        password,
      });

      const { count } = await dao.countUsers();
      const { insertedId } = await dao.create(newUser);

      initialCount = count;
      returnedId = insertedId;
      expectedId = newUser._id;
    });

    it("returns the inserted user's id and updates the collection", () => {
      expect(returnedId).toEqual(expectedId);
    });

    it('updates the collection', async () => {
      const { count } = await dao.countUsers();
      expect(count).toEqual(initialCount + 1);
    });
  });

  describe('when finding a user by username', () => {
    describe('and a user with the username exists', () => {
      const expectedUser = userDaoFixtures[0];
      let returnedUser: User;

      beforeEach(async () => {
        const { username } = expectedUser;
        returnedUser = (await dao.findByUsername(username)) as User;
      });

      it('returns the expected user', () => {
        expect(returnedUser).toEqual(expectedUser);
      });
    });

    describe('and a user with the username does not exist', () => {
      let returnedUser: User;

      beforeEach(async () => {
        returnedUser = (await dao.findByUsername('thisIsNotAUsername')) as User;
      });

      it('does not return a user', () => {
        expect(returnedUser).toBeNull();
      });
    });
  });

  describe('when deleting a user by username', () => {
    let initialCount: number;
    let numberDeleted: number;

    beforeEach(async () => {
      const { count } = await dao.countUsers();
      initialCount = count;
    });

    describe('and a user with the username exists', () => {
      beforeEach(async () => {
        const { n } = await dao.deleteByUsername('nayru@hylia.com');
        numberDeleted = n;
      });

      it('returns that one document was modified', () => {
        expect(numberDeleted).toEqual(1);
      });

      it('updates the collection', async () => {
        const { count } = await dao.countUsers();
        expect(count).toEqual(initialCount - 1);
      });
    });

    describe('and a user with the username does not exist', () => {
      beforeEach(async () => {
        const { n } = await dao.deleteByUsername('link@hylia.com');
        numberDeleted = n;
      });

      it('returns that no documents were modified', () => {
        expect(numberDeleted).toEqual(0);
      });

      it('does not update the collection', async () => {
        const { count } = await dao.countUsers();
        expect(count).toEqual(initialCount);
      });
    });
  });
});
