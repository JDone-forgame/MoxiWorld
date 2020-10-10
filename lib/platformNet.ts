import { http_quest, ConfigMgr } from "mx-tool";
import { makeGameSing } from "./makeGameSing";

export class PlatformNet {
    static sendItem<T>(itemid: string, count: number, uid: string, activeid: string) {
        let info = {
            itemid: itemid,
            count: count.toString(),
            roleid: uid,
            activeid: activeid,
            sign: ''
        };
        info.sign = makeGameSing(info);
        return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.additem"), info, 0, null, { respon_type: 'json' })
    }

    static sendPack<T>(packid: string, uid: string, activeid: string) {
        let info = {
            packid: packid,
            targetid: uid,
            activeid: activeid,
            sign: ''
        };
        info.sign = makeGameSing(info);
        return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.addpack"), info, 0, null, { respon_type: 'json' })
    }

    static sendGameResult<T>(activeid: string, uid: string, gameid: string, level: number, addScore: number, score: number) {
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
        info.sign = makeGameSing(info);
        return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.gameresult"), info, 0, null, { respon_type: 'json' })
    }

    static sendFinalAward<T>(activeid: string, uid: string, gameid: string) {
        let info = {
            activeid: activeid,
            uid: uid,
            gameid: gameid,
            sign: ''
        };
        info.sign = makeGameSing(info);
        return http_quest<T>("get", ConfigMgr.get("platform.url") + ConfigMgr.get("platform.finalaward"), info, 0, null, { respon_type: 'json' })
    }
}