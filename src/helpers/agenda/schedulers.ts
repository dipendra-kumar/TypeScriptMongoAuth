import { forgotPasswordModel } from "src/models/password_recovery.model"
import { runJobEveryTime } from "./job.helper"
import jobDefinitions from "./jobs.definitions"

export const handleScheduleTasks = async () => {
    await jobDefinitions.removeExpiredTokens(forgotPasswordModel).then(() => runJobEveryTime("delete_expired_tokens", "1 minutes"))
}