import Agenda from "agenda";
import logger from "src/helpers/logger/logger";


const agenda = new Agenda({
    db: {
        address: process.env.DB_URL,
        collection: 'agendaJobs',
    },
    maxConcurrency: 20,
})

agenda.on('ready', () => logger.info("Event Scheduler is up!"))
agenda.on('error', () => logger.error("Event scheduler connection error"))

export default agenda;