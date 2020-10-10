"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformNet = void 0;
const mx_tool_1 = require("mx-tool");
const makeGameSing_1 = require("./makeGameSing");
class PlatformNet {
    static sendItem(itemid, count, uid, activeid) {
        let info = {
            itemid: itemid,
            count: count.toString(),
            roleid: uid,
            activeid: activeid,
            sign: ''
        };
        info.sign = makeGameSing_1.makeGameSing(info);
        return mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.additem"), info, 0, null, { respon_type: 'json' });
    }
    static sendPack(packid, uid, activeid) {
        let info = {
            packid: packid,
            targetid: uid,
            activeid: activeid,
            sign: ''
        };
        info.sign = makeGameSing_1.makeGameSing(info);
        return mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.addpack"), info, 0, null, { respon_type: 'json' });
    }
    static sendGameResult(activeid, uid, gameid, level, addScore, score) {
        // fixme
        let info = {
            activeid: activeid,
            uid: uid,
            gameid: gameid,
            level: level,
            addScore: addScore,
            score: score,
            sign: ''
        };
        // let info = {
        //     activeid: 'A_10408_R_50_D_20200713',
        //     uid: 'AAG9uhSAAJs_NHwZhlBvNb-H',
        //     gameid: '4711d45a99e3a3eeef765e7812e33c69',
        //     level: 1,
        //     addScore: 2,
        //     score: 3,
        //     sign: ''
        // };
        info.sign = makeGameSing_1.makeGameSing(info);
        return mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.gameresult"), info, 0, null, { respon_type: 'json' });
    }
    static sendFinalAward(activeid, uid, gameid) {
        let info = {
            activeid: activeid,
            uid: uid,
            gameid: gameid,
            sign: ''
        };
        info.sign = makeGameSing_1.makeGameSing(info);
        return mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.finalaward"), info, 0, null, { respon_type: 'json' });
    }
}
exports.PlatformNet = PlatformNet;
//# sourceMappingURL=platformNet.js.map