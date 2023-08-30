import logger from "../logger/logger";
import { defineJob } from "./job.helper";

const jobDefinitions = {

    removeExpiredTokens: async (dbModel: any) => defineJob("delete_expired_tokens", async () => {
        try {
            await dbModel.deleteMany({ expiresAt: { $lt: Date.now() } });
        } catch (error) {
            throw new Error(error)
        }
    }),

}

export default jobDefinitions;