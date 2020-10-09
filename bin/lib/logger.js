"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInstance = void 0;
const mx_tool_1 = require("mx-tool");
const mx_logger_1 = require("mx-logger");
class Logger extends mx_logger_1.LoggerMoudle {
    constructor() {
        super();
        this.name = "Logger";
    }
    weeklyScoreLog(gameID, pltID, score, iadd, activeid) {
        let log = {
            sgameID: gameID,
            stype: "add",
            iscore: score,
            iadd: iadd,
            sactiveid: activeid,
            record_time: mx_tool_1.LocalDate.now()
        };
        this.logEvent(pltID, "weeklyScore", log);
    }
    energyLog(gameID, pltID, score, activeid) {
        let log = {
            sgameID: gameID,
            stype: "set",
            iscore: score,
            sactiveid: activeid,
            record_time: mx_tool_1.LocalDate.now()
        };
        this.logEvent(pltID, "energy", log);
    }
    weeklyAwardLog(gameID, pltID, stype, sitemid, activeid) {
        let log = {
            sgameID: gameID,
            stype: stype,
            sitemid: sitemid,
            sactiveid: activeid,
            record_time: mx_tool_1.LocalDate.now()
        };
        this.logEvent(pltID, "weeklyAward", log);
    }
    finalAwardLog(gameID, pltID, score, activeid) {
        let log = {
            sgameID: gameID,
            stype: "add",
            iscore: score,
            sactiveid: activeid,
            record_time: mx_tool_1.LocalDate.now()
        };
        this.logEvent(pltID, "energy", log);
    }
}
exports.LoggerInstance = new Logger();
//# sourceMappingURL=logger.js.map