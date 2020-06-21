import { Router, Request, Response, NextFunction } from 'express';
import UserSvc from 'src/svc/userSvc';
import ServerError from 'src/models/serverError';
import { MalformedRequestError } from 'src/models/serverErrorTypes';

const userSvc = new UserSvc();

function hasRequiredFields(fields: { [key: string]: any }, fieldNames: Array<string>) {
  return fieldNames.reduce((acc, fieldName) => {
    return acc || !fields[fieldName];
  }, false);
}

// methods

const REGISTER_USER_FIELDNAMES = ['username', 'password', 'confirmPassword'];
async function registerUser(req: Request, resp: Response, next: NextFunction) {
  const {
    body: { username, password, confirmPassword },
  } = req;

  if (hasRequiredFields({ username, password, confirmPassword }, REGISTER_USER_FIELDNAMES)) {
    const error = new ServerError(MalformedRequestError.CREATE_USER, REGISTER_USER_FIELDNAMES);
    next(error);
    return;
  }

  try {
    const newUser = await userSvc.create({ username, password, confirmPassword });
    resp.json(newUser);
  } catch (error) {
    next(error);
  }
}

// routes
const userRoutes = Router();
userRoutes.post('/', registerUser);

export const userBaseUrl = '/user';
export default userRoutes;
