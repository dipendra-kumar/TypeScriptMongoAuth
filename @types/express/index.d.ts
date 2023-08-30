import { IUser } from 'src/types/custom_interface';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends IUser { }
    interface Request {
      user?: User;
    }
  }
}
