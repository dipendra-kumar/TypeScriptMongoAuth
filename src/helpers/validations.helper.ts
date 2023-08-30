import { Request, Response, NextFunction, response } from 'express';
import { handleErrorResponse } from 'src/modules/utils/response.helper';
import HttpStatus from 'src/constants/httpStatus';
import responseMessages from 'src/constants/messages';


export const validationConfig = {
    first_name: {
        regex: /^[a-zA-Z ]{3,30}$/,
        errorMessage: responseMessages.INVALID_FIRST_NAME,
    },
    last_name: {
        regex: /^[a-zA-Z ]{3,30}$/,
        errorMessage: responseMessages.INVALID_LAST_NAME,
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: responseMessages.INVALID_EMAIL_FORMAT,
    },
    phone: {
        regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        errorMessage: responseMessages.INVALID_PHONE_FORMAT,
    },
    password: {
        regex: /^(?=.*[@#$%^&+=])(?=.*[A-Z])(?=.*\d)(?=\S+$).{6,}$/,
        errorMessage: responseMessages.INVALID_PASSWORD,
    },
    latitude: {
        regex: /^-?([1-8]?\d(?:\.\d{1,6})?|90(?:\.0{1,6})?)$/,
        errorMessage: responseMessages.INVALID_LAT
    },
    longitude: {
        regex: /^-?((?:1[0-7]|[1-9])?\d(?:\.\d{1,6})?|180(?:\.0{1,6})?)$/,
        errorMessage: responseMessages.INVALID_LONG
    },
    zip_code: {
        regex: /^[1-9]{1}\d{2}\s?\d{3}$/,
        errorMessage: responseMessages.INVALID_ZIPCODE
    },
    city: {
        regex: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
        errorMessage: responseMessages.INVALID_CITY
    },
    state: {
        regex: /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/,
        errorMessage: responseMessages.INVALID_STATE
    },
};

export const validateField = (
    req: Request,
    res: Response,
    next: NextFunction,
    fieldName: string,
    regex: RegExp,
    errorMessage: string
) => {
    const value = req.body[fieldName];

    if (!regex.test(value)) {
        return handleErrorResponse(res, HttpStatus.BAD_REQUEST, errorMessage);
    }
    return next();
};
