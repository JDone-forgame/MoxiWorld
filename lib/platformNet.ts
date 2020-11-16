import { sign } from "crypto";
import { http_quest, ConfigMgr } from "mx-tool";
import { ErrorCode } from "../defines/define";
import { LoggerMoudle } from "./logger";
import { makeGameSing } from "./makeGameSing";

export class PlatformNet {

    // 上报分数
    static sendGameResult<T>(activeid: string, uid: string, gameid: string, level: number, addScore: number, score: number) {
        let info = {
            activeid: activeid,
            uid: uid,
            gameid: gameid,
            level: level,
            addScore: addScore,
            score: score,
            sign: ''
        }
        info.sign = makeGameSing(info)
        return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.gameresult"), info, 0, null, { respon_type: 'json' })
    }

    // 上报排行榜
    static addRank<T>(rankId: string, unitInfo: object, unitId: string, score: number, pltId: string) {
        let info = {
            rankId: rankId,
            unitInfo: unitInfo,
            unitId: unitId,
            score: score,
            pltId: pltId,
            sign: ''
        }
        // 这里因为unitInfo是object类型没做验证，本应该是要加sign的
        return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.addrank"), info, 0, null, { respon_type: 'json' })
    }

    // 增加平台物品日志
    static async sendItem<T>(gameId: string, itemid: string, count: number, uid: string, activeid: string) {
        let info = {
            itemid: itemid,
            count: count.toString(),
            roleid: uid,
            activeid: activeid,
            sign: ''
        };
        info.sign = makeGameSing(info);
        try {
            //return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.additem"), info, 0, null, { respon_type: 'json' })
            let v: any = await http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.additem"), info, 0, null, { respon_type: 'json' });
            if (v && v.code == 0) {
                // 成功
                LoggerMoudle.addPlatformItem(gameId, itemid, count, uid, activeid, 0);
                return v;
            } else {
                // 失败
                LoggerMoudle.addPlatformItem(gameId, itemid, count, uid, activeid, ErrorCode.platform_add_item_fail);
                throw { code: ErrorCode.platform_add_item_fail,  errMsg: 'platfom add item fail'};
            }
        } catch (e) {
            // 失败
            LoggerMoudle.addPlatformItem(gameId, itemid, count, uid, activeid, ErrorCode.platform_api_query_error);
            throw { code: ErrorCode.platform_api_query_error,  errMsg: e};
        }
    }

}