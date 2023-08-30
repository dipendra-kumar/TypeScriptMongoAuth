
import { Response } from 'express';
import * as CommonUtils from 'src/helpers/commonUtils';

export const handleErrorResponse = (res: Response, status: number, message: string) => {
    const response = CommonUtils.generateErrorResponse(status, message);
    return res.status(status).json(response);
};

export const handleSuccessResponse = (res: Response, status: number, message: string, data?: any) => {
    const response = data
        ? CommonUtils.generateSuccessResponse(status, message, data)
        : CommonUtils.generateSuccessResponse(status, message);
    return res.status(status).json(response);
};


export const redirectHandler = (res: Response, file: string) => {
    return res.sendFile(file);
}