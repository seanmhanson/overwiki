import HashedPassword from 'src/models/hashedPassword';
import UserDao from 'src/dao/userDao';
import User from 'src/models/user';

// subject
import UserSvc from 'src/svc/userSvc';

// mock imported classes
jest.mock('src/models/hashedPassword');
jest.mock('src/dao/userDao');
jest.mock('src/models/user');

// set references for mocked classes
const HashedPasswordMock = (HashedPassword as unknown) as jest.Mock<HashedPassword>;
const UserDaoMock = (UserDao as unknown) as jest.Mock<UserDao>;
const UserMock = (User as unknown) as jest.Mock<User>;

// constants
const username = 'username';
const password = 'password';
const userFixture = new User({ username, password: new HashedPassword() });

describe('src/svc/userSvc', () => {
  let userSvc: UserSvc;
  let mockDaoInstance: UserDao;

  beforeEach(async () => {
    jest.clearAllMocks();

    userSvc = new UserSvc();
    await userSvc.init();

    mockDaoInstance = UserDaoMock.mock.instances[0];
  });

  describe('when creating a user', () => {
    let mockPasswordInstance: HashedPassword;

    beforeEach(async () => {
      await userSvc.create({ username, password });
      mockPasswordInstance = HashedPasswordMock.mock.instances[0];
    });

    it('hashes the password', () => {
      expect(HashedPasswordMock).toHaveBeenCalledTimes(1);
      expect(mockPasswordInstance.setPassword).toHaveBeenCalledTimes(1);
      expect(mockPasswordInstance.setPassword).toHaveBeenCalledWith(password);
    });

    it('creates a new user instance', () => {
      expect(UserMock).toHaveBeenCalledTimes(1);
    });

    it('calls to insert the new user', () => {
      expect(mockDaoInstance.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('when trying to create a user with an existing username', () => {
    beforeEach(() => {
      jest.spyOn(mockDaoInstance, 'findByUsername').mockResolvedValue(userFixture);
    });

    it('throws an error and does not create the user', async () => {
      await expect(() => userSvc.create({ username, password })).rejects.toThrow();

      expect(UserMock).not.toHaveBeenCalled();
      expect(HashedPasswordMock).not.toHaveBeenCalled();
      expect(mockDaoInstance.create).not.toHaveBeenCalled();
    });
  });

  describe('when trying to create a user with an invalid password', () => {
    beforeEach(() => {
      jest.spyOn(HashedPassword.prototype, 'setPassword').mockImplementation(() => {
        throw new Error();
      });
    });

    it('throws an error and does not create the user', async () => {
      await expect(() => userSvc.create({ username, password })).rejects.toThrow();

      expect(UserMock).not.toHaveBeenCalled();
      expect(HashedPasswordMock).toHaveBeenCalled();
      expect(mockDaoInstance.create).not.toHaveBeenCalled();
    });
  });
});
