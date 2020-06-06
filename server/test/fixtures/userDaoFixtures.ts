import User from 'src/models/user';
import HashedPassword from 'src/models/hashedPassword';

export default [
  new User({
    username: 'din@hylia.com',
    password: new HashedPassword(),
  }),
  new User({
    username: 'nayru@hylia.com',
    password: new HashedPassword(),
  }),
  new User({
    username: 'farore@hylia.com',
    password: new HashedPassword(),
  }),
];
