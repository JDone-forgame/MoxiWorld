"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformNet = void 0;
const mx_tool_1 = require("mx-tool");
const define_1 = require("../defines/define");
const logger_1 = require("./logger");
const makeGameSing_1 = require("./makeGameSing");
class PlatformNet {
    // 上报分数
    static sendGameResult(activeid, uid, gameid, level, addScore, score) {
        let info = {
            activeid: activeid,
            uid: uid,
            gameid: gameid,
            level: level,
            addScore: addScore,
            score: score,
            sign: ''
        };
        info.sign = makeGameSing_1.makeGameSing(info);
        return mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.gameresult"), info, 0, null, { respon_type: 'json' });
    }
    // 上报排行榜
    static addRank(rankId, unitInfo, unitId, score, pltId) {
        let info = {
            rankId: rankId,
            unitInfo: unitInfo,
            unitId: unitId,
            score: score,
            pltId: pltId,
            sign: ''
        };
        // 这里因为unitInfo是object类型没做验证，本应该是要加sign的
        return mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.addrank"), info, 0, null, { respon_type: 'json' });
    }
    // 增加平台物品日志
    static sendItem(gameId, itemid, count, uid, activeid) {
        return __awaiter(this, void 0, void 0, function* () {
            let info = {
                itemid: itemid,
                count: count.toString(),
                roleid: uid,
                activeid: activeid,
                sign: ''
            };
            info.sign = makeGameSing_1.makeGameSing(info);
            try {
                //return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.additem"), info, 0, null, { respon_type: 'json' })
                let v = yield mx_tool_1.http_quest("get", mx_tool_1.ConfigMgr.get("platform.url") + mx_tool_1.ConfigMgr.get("platform.additem"), info, 0, null, { respon_type: 'json' });
                if (v && v.code == 0) {
                    // 成功
                    logger_1.LoggerMoudle.addPlatformItem(gameId, itemid, count, uid, activeid, 0);
                    return v;
                }
                else {
                    // 失败
                    logger_1.LoggerMoudle.addPlatformItem(gameId, itemid, count, uid, activeid, define_1.ErrorCode.platform_add_item_fail);
                    throw { code: define_1.ErrorCode.platform_add_item_fail, errMsg: 'platfom add item fail' };
                }
            }
            catch (e) {
                // 失败
                logger_1.LoggerMoudle.addPlatformItem(gameId, itemid, count, uid, activeid, define_1.ErrorCode.platform_api_query_error);
                throw { code: define_1.ErrorCode.platform_api_query_error, errMsg: e };
            }
        });
    }
}
exports.PlatformNet = PlatformNet;
//# sourceMappingURL=platformNet.js.map