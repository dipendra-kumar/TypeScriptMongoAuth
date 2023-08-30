import { Request, Response } from 'express';
import { userModel } from 'src/models/users.model';
import { createAuthToken } from 'src/helpers/jwt.helper';
import { validateRegisterFields } from './userValidations';
import {
  handleSuccessResponse,
  handleErrorResponse,
} from 'src/modules/utils/response.helper';
import messages from 'src/constants/messages';
import HttpStatus from 'src/constants/httpStatus';
import {
  encryptPassword,
  matchUserPassword,
} from 'src/modules/utils/user.helper';

export const checkAvailability = async (
  req: Request,
  res: Response,
  field: string,
  message: string,
  existingMessage: string
) => {
  const value = req.body[field];
  try {
    const pipeline = [{ $match: { [field]: value } }];
    const data = await userModel.aggregate(pipeline);
    if (data.length === 0) {
      handleSuccessResponse(res, HttpStatus.OK, message);
    } else {
      handleErrorResponse(res, HttpStatus.BAD_REQUEST, existingMessage);
    }
  } catch (error) {
    handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    address,
    zip_code,
    city,
    state,
  } = req.body;
  try {
    const errors = validateRegisterFields(req.body);
    if (errors.length > 0) {
      return handleErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        errors.join(', ')
      );
    }

    const userExist = await userModel.findOne({ $or: [{ email }, { phone }] });
    if (userExist) {
      return handleErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        messages.USER_ALREADY_EXISTS
      );
    }

    const newUser = new userModel({
      first_name,
      last_name,
      email,
      phone,
      address,
      zip_code,
      city,
      state,
      password: await encryptPassword(password),
      wallet_balance: 0,
    });
    await newUser.save();

    const authToken = createAuthToken({
      email: newUser.email,
      expires_in: '1h',
    });
    return handleSuccessResponse(
      res,
      HttpStatus.OK,
      messages.REGISTRATION_SUCCESS,
      authToken
    );
  } catch (error) {
    return handleErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const userData = req.user;
    if (!userData) {
      return handleErrorResponse(
        res,
        HttpStatus.BAD_REQUEST,
        messages.INVALID_EMAIL_FORMAT
      );
    }
    return handleSuccessResponse(
      res,
      HttpStatus.OK,
      messages.DATA_FETCHED_SUCESSFULLY,
      userData
    );
  } catch (error) {
    return handleErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return handleErrorResponse(
      res,
      HttpStatus.BAD_REQUEST,
      messages.FIELDS_REQUIRED
    );

  try {
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      return handleErrorResponse(
        res,
        HttpStatus.FORBIDDEN,
        messages.USER_NOT_FOUND
      );
    }

    const matchPassword = await matchUserPassword(userData.password, password);
    if (!matchPassword) {
      return handleErrorResponse(
        res,
        HttpStatus.UNAUTHORIZED,
        messages.INVALID_CREDS
      );
    }

    const authToken = createAuthToken({
      email: userData.email,
      expires_in: '1h',
    });

    return handleSuccessResponse(
      res,
      HttpStatus.OK,
      messages.LOGIN_SUCCESS,
      authToken
    );
  } catch (error) {
    return handleErrorResponse(
      res,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
};
