import { Request, Response } from "express";
import { validateRegisterFields } from "./userValidations";
import { handleErrorResponse, handleSuccessResponse, redirectHandler } from "src/modules/utils/response.helper";
import HttpStatus from "src/constants/httpStatus";
import { encryptPassword, matchUserPassword, saveLoginSessions } from "src/modules/utils/user.helper";
import responseMessages from "src/constants/messages";
import { loginHistoryModel } from "src/models/login_history.model";
import { forgotPasswordModel } from "src/models/password_recovery.model";
import { sendMail } from "src/helpers/mail.helper";
import { userModel } from "src/models/users.model";
import { createAuthToken } from "src/helpers/jwt.helper";


export const updateProfilePicture = async (req: Request, res: Response) => {
    const profilePic = req.file;
    const uploadLocation = `uploads/${profilePic?.filename}`;
    try {
        await userModel.findOneAndUpdate(
            { email: req.user.email },
            { profile_pic: uploadLocation }
        );
        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.PROFILE_PIC_UPDATED, uploadLocation);
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
};

export const changePassword = async (req: Request, res: Response) => {
    const { password, newPassword, confirmNewPassword } = req.body;
    try {
        if (!newPassword || !confirmNewPassword) {
            return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.FIELDS_REQUIRED)
        }
        if (newPassword !== confirmNewPassword) {
            return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.PASSWORD_DONT_MATCH)
        }

        const errors = validateRegisterFields({ password: newPassword });
        if (errors.length > 0) {
            return handleErrorResponse(res, HttpStatus.BAD_REQUEST, errors.join(", "));
        }

        const userData = await userModel.findOne({ email: req.user.email });

        const matchPassword = await matchUserPassword(userData.password, password);
        if (!matchPassword) {
            return handleErrorResponse(res, HttpStatus.UNAUTHORIZED, responseMessages.INVALID_CREDS)
        }

        await userModel.findOneAndUpdate(req.user, { password: await encryptPassword(newPassword) })
        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.PASSWORD_UPDATED)

    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body
    try {
        const userExist = await userModel.findOne({ email })
        if (!userExist) return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.USER_NOT_FOUND)

        const resetToken = createAuthToken({
            email: userExist.email, 
            expires_in: "5m"
        })

        const forgotPasswordDetails = new forgotPasswordModel({
            email: userExist.email,
            token: resetToken,
            expiresAt: Date.now() + 5 * 60000
        })
        await forgotPasswordDetails.save();

        const userMailObject = {
            email: userExist.email,
            name: userExist.first_name,
            token: resetToken,
            type: "resetPassword"
        };
        await sendMail(userMailObject);
        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.MAIL_SENT_SUCCESSFULLY)
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
        return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.FIELDS_REQUIRED)
    }
    if (newPassword !== confirmNewPassword) return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.PASSWORD_DONT_MATCH)

    try {
        const errors = validateRegisterFields({ password: newPassword });
        if (errors.length > 0) {
            return handleErrorResponse(res, HttpStatus.BAD_REQUEST, errors.join(", "));
        }

        const userInfo = await userModel.findOneAndUpdate({ email: req.user.email }, { password: await encryptPassword(newPassword) })
        console.log(userInfo)

        await forgotPasswordModel.findOneAndDelete({ email: userInfo.email });

        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.PASSWORD_UPDATED)
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const updateLoginHistory = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, device_id, device_info } = req.body;

        // const errors = validateRegisterFields({ latitude, longitude });
        // if (errors.length > 0) {
        //     return handleErrorResponse(res, HttpStatus.BAD_REQUEST, errors.join(", "));
        // }

        await saveLoginSessions(req.user.email, device_id, device_info, latitude, longitude,)

        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.LOCATION_UPDATED)
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const getLoginHistory = async (req: Request, res: Response) => {
    try {
        const { email } = req.user

        const loginData = await loginHistoryModel.findOne({ email }).select("-_id");
        if (!loginData) {
            return handleErrorResponse(res, HttpStatus.BAD_REQUEST, responseMessages.NO_LOGIN_HISTORY_FOUND)
        }
        const userLoginData = JSON.parse(JSON.stringify(loginData))
        userLoginData.login_history.reverse().forEach(loginData => delete loginData._id);

        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.LOGIN_DATA_FETCHED_SUCCESSFULLY, userLoginData);
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const sendVerifyMail = async (req: Request, res: Response) => {
    try {
        const userInfo = {
            email: req.user.email,
            name: req.user.first_name,
            token: await createAuthToken({ email: req.user.email, expires_in: "24h" }),
            type: "verifyEmail"
        }
        await sendMail(userInfo);
        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.MAIL_SENT_SUCCESSFULLY)
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        await userModel.findOneAndUpdate(req.user, { email_verified: 1 })
        return handleSuccessResponse(res, HttpStatus.OK, responseMessages.EMAIL_VERIFIED)
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}


export const emailRedirect = async (req: Request, res: Response,) => {
    if (!req.query.token) {
        return handleErrorResponse(res, HttpStatus.FORBIDDEN, responseMessages.UNAUTHORIZED)
    }
    try {
        const file: string = process.cwd() + "/src/views/redirect.html"
        return redirectHandler(res, file)
    } catch (error) {
        return handleErrorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.message)
    }
}