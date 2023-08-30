import { formatDate } from "src/helpers/commonUtils";
import { loginHistoryModel } from "src/models/login_history.model";
import bcrypt from 'bcrypt'
import logger from "src/helpers/logger/logger";


export const saveLoginSessions = async (email: string, deviceId: string, deviceInfo: string, latitude: Number, longitude: Number) => {
    try {
        const currentDate = new Date();
        const userLoginRecord = {
            device_id: deviceId, location: {
                latitude, longitude
            }, date_time: formatDate(currentDate),
            device_info: deviceInfo
        };

        const updateResult = await loginHistoryModel.findOneAndUpdate(
            { email: email },
            { $push: { login_history: userLoginRecord } },
            { upsert: true, new: true } // upsert => Create if not found, and return the updated document
        ).select("-_id");

        return updateResult.login_history;
    } catch (error) {
        throw error;
    }
};


export const encryptPassword = async (plainPassword: string) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        return bcrypt.hash(plainPassword, salt);
    } catch (error) {
        logger.error(error);
        return;
    }
};

export const matchUserPassword = async (userPassword: string, frontEndPassword: string) => {
    return await bcrypt.compare(frontEndPassword, userPassword)
}
