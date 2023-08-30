import agenda from "src/config/agenda.config";
import logger from "../logger/logger";

export const defineJob = (jobName: string, cb: any) => {
    agenda.define(jobName, cb)
}

export const runJobEveryTime = async (jobName: string, time: string) => {
    logger.info("Event Started: " + jobName + ",  Interval: " + time)
    await agenda.start();
    await agenda.every(time, jobName)
}
