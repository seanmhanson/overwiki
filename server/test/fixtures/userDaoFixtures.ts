import { User, HashedPassword } from 'models';

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
