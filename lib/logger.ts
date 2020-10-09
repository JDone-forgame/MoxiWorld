import { ConfigMgr, LocalDate } from 'mx-tool'
import { LoggerMoudle as LM } from "mx-logger"

class Logger extends LM<string> {
    name = "Logger"
    constructor() {
        super()
    }


    weeklyScoreLog(gameID: string, pltID: string, score: number, iadd: number, activeid: string) {
        let log = {
            sgameID: gameID,
            stype: "add",
            iscore: score,
            iadd: iadd,
            sactiveid: activeid,
            record_time: LocalDate.now()
        }

        this.logEvent(pltID, "weeklyScore", log)
    }

    energyLog(gameID: string, pltID: string, score: number, activeid: string) {
        let log = {
            sgameID: gameID,
            stype: "set",
            iscore: score,
            sactiveid: activeid,
            record_time: LocalDate.now()
        }

        this.logEvent(pltID, "energy", log)
    }

    weeklyAwardLog(gameID: string, pltID: string, stype: string, sitemid: string, activeid: string) {
        let log = {
            sgameID: gameID,
            stype: stype,
            sitemid: sitemid,
            sactiveid: activeid,
            record_time: LocalDate.now()
        }

        this.logEvent(pltID, "weeklyAward", log)
    }

    finalAwardLog(gameID: string, pltID: string, score: number, activeid: string) {
        let log = {
            sgameID: gameID,
            stype: "add",
            iscore: score,
            sactiveid: activeid,
            record_time: LocalDate.now()
        }

        this.logEvent(pltID, "energy", log)
    }
}

export var LoggerInstance = new Logger()