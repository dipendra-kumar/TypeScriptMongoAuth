import { Router } from 'express';
import {
  checkAvailability,
  getUserDetails,
  loginUser,
  registerUser,
} from './user.controller';
import responseMessages from 'src/constants/messages';
import { validateEmail, validatePhone } from './userValidations';
import { handleImageUpload } from 'src/config/multer.config';
import { authUser } from 'src/modules/middlewares/auth.middleware';
import {
  changePassword,
  emailRedirect,
  forgotPassword,
  getLoginHistory,
  resetPassword,
  sendVerifyMail,
  updateLoginHistory,
  updateProfilePicture,
  verifyEmail,
} from './user_actions.controller';

export const userRouter = Router();

userRouter.post('/checkEmailAvailability', validateEmail, (req, res, next) =>
  checkAvailability(
    req,
    res,
    'email',
    responseMessages.EMAIL_AVAILABLE,
    responseMessages.EMAIL_ALREADY_EXISTS
  )
);

userRouter.post(
  '/checkPhoneNumberAvailability',
  validatePhone,
  (req, res, next) =>
    checkAvailability(
      req,
      res,
      'phone',
      responseMessages.PHONE_AVAILABLE,
      responseMessages.PHONE_ALREADY_EXISTS
    )
);

userRouter.post('/login', loginUser);
userRouter.post('/registerUser', registerUser);

userRouter.post(
  '/uploadProfile',
  authUser,
  handleImageUpload,
  updateProfilePicture
); // make sure the frontend profile field is "profile_pic"

userRouter.get('/getUserDetails', authUser, getUserDetails);

userRouter.patch('/changePassword', authUser, changePassword);

userRouter.post('/forgotPassword', validateEmail, forgotPassword);

userRouter.patch('/resetPassword', authUser, resetPassword);

userRouter.post('/updateLoginHistory', authUser, updateLoginHistory);

userRouter.get('/getLoginHistory', authUser, getLoginHistory);

userRouter.get('/redirect', emailRedirect); // this api is for mobile devices to redirect to their app on mail link

userRouter.get('/verifyEmail', authUser, verifyEmail);

userRouter.get('/sendVerifyMail', authUser, sendVerifyMail);
