"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMoudle = void 0;
const mx_tool_1 = require("mx-tool");
const mx_logger_1 = require("mx-logger");
class Logger extends mx_logger_1.LoggerMoudle {
    constructor() {
        super();
        this.name = "Logger";
    }
    /**-----------------------------------------生成日志------------------------------------------------------ */
    createlog(arrayList = [], outParam = {}) {
        // 有几个是必须要有的添加一下
        let needslist = ['record_time'];
        for (let i = 0; i < needslist.length; i++) {
            if (arrayList.indexOf(needslist[i]) < 0) {
                arrayList.push(needslist[i]);
            }
        }
        // 生成日志的通用接口
        let outLog = {};
        let extList = [];
        for (let key in arrayList) {
            let sKey = arrayList[key];
            switch (sKey) {
                case 'platId':
                    outLog[sKey] = mx_tool_1.ConfigMgr.get('id') || '';
                    break;
                case 'record_time':
                    outLog[sKey] = mx_tool_1.LocalDate.formateString();
                    break;
                default:
                    if (outParam.hasOwnProperty(sKey)) {
                        outLog[sKey] = outParam[sKey];
                    }
                    else {
                        extList.push(sKey);
                    }
                    break;
            }
        }
        return outLog;
    }
    /**-----------------------------------------角色注册日志-------------------------------------------------- */
    roleRegist(gameId, uid, activeid, inviteid) {
        let outList = [
            'sUid',
            'sActiveid',
            'sInviteid'
        ];
        let outParam = {
            'sUid': (uid || "").toString(),
            "sActiveid": (activeid || "").toString(),
            'sInviteid': (inviteid || "").toString()
        };
        this.logEvent(gameId, 'roleRegist', this.createlog(outList, outParam));
    }
    /**-----------------------------------------角色登录日志-------------------------------------------------- */
    roleLogin(gameId, uid, activeid, inviteid) {
        let outList = [
            'sUid',
            'sActiveid',
            'sInviteid'
        ];
        let outParam = {
            'sUid': (uid || "").toString(),
            "sActiveid": (activeid || "").toString(),
            'sInviteid': (inviteid || "").toString()
        };
        this.logEvent(gameId, 'roleLogin', this.createlog(outList, outParam));
    }
    /**-----------------------------------------增加平台物品日志----------------------------------------------- */
    addPlatformItem(gameId, itemid, count, uid, activeid, result) {
        let outList = [
            'sItemid',
            'iCount',
            'sUid',
            'sActiveid',
            'iResult'
        ];
        let outParam = {
            'sItemid': (itemid || "").toString(),
            'iCount': count || 0,
            'sUid': (uid || "").toString(),
            'sActiveid': activeid,
            'iResult': result
        };
        this.logEvent(gameId, 'addPlatformItem', this.createlog(outList, outParam));
    }
}
exports.LoggerMoudle = new Logger();
//# sourceMappingURL=logger.js.map