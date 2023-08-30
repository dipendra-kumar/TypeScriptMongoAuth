import { Request, Response, NextFunction } from 'express';
import { handleErrorResponse } from 'src/modules/utils/response.helper';
import { validateAuthToken } from 'src/helpers/jwt.helper';
import { userModel } from 'src/models/users.model';
import HttpStatus from 'src/constants/httpStatus';
import responseMessages from 'src/constants/messages';
import { forgotPasswordModel } from 'src/models/password_recovery.model';

export const authUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.query?.token.toString();

    if (!token) {
      return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.AUTH_TOKEN_REQUIRED);
    }

    const { payload } = validateAuthToken(token);

    if (!payload) {
      return handleErrorResponse(res, HttpStatus.UNAUTHORIZED, responseMessages.INVALID_AUTH_TOKEN);
    }

    const userData = await userModel.findOne({ email: payload.email, })
      .select('-password -_id');

    if (!userData) {
      return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.USER_NOT_FOUND);
    }
    const elgibleToReset = await forgotPasswordModel.findOne({
      $and: [
        { email: userData.email },
        { token: token }
      ]
    })
    if (req.query?.token && !elgibleToReset) {
      return handleErrorResponse(res, HttpStatus.UNAUTHORIZED, responseMessages.UNAUTHORIZED)
    }
    if (req.query.token && new Date(elgibleToReset.expiresAt).getTime() < Date.now()) {
      await forgotPasswordModel.findOneAndDelete({ email: userData.email });
      return handleErrorResponse(res, HttpStatus.FORBIDDEN, responseMessages.TOKEN_EXPIRED)
    }
    req.user = userData;
    return next();
  } catch {
    return handleErrorResponse(res, HttpStatus.UNAUTHORIZED, responseMessages.AUTH_REQUIRED);
  }
};
