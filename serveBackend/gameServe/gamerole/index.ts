import { createHash } from "crypto";
import { ConfigMgr, http_quest, LocalDate } from "mx-tool";
import { MongodbMoudle } from "mx-database";
import { DBDefine, ErrorCode } from "../../../defines/define";
import { LoggerInstance } from "../../../lib/logger";
import { UnitRole } from "./role";
import { PlatformNet } from "../../../lib/platformNet";

export class GameRoleService {
    static init() {
        return UnitRole.init();
    }

    // 登录
    static async login(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string, platform: { [key: string]: string } = {}) {
        return new Promise(function (resolve, reject) {
            UnitRole.getRole(gameId).then(function (data) {
                GameRoleService._loadSucc(gameId, data.role, version, platform).then(resolve).catch(e => {
                    reject({ code: ErrorCode.db_error, errMsg: "db is error" })
                });
            }).catch(e => {
                if (e.code == ErrorCode.role_no) {
                    UnitRole.registRole(gameId, uid, unionid, openid, session_key, version).then(data => {
                        GameRoleService._loadSucc(gameId, data.role, version, platform).then(resolve).catch(e => {
                            reject({ code: ErrorCode.db_error, errMsg: "db is error" })
                        });
                    })
                }
                else {
                    // 失败的时候
                    GameRoleService._loadFailed(reject);
                }
            })
        })

    }

    // 玩家登录成功后的消息推送
    private static async _loadSucc(gameId: string, role: UnitRole, version: string, platform: { [key: string]: string }) {
        // 提取出用信息推送
        // 需要设置用户一个token 后续通过token来判断登录状态
        let token = createHash("md5").update('' + Date.now() + gameId + role.session_key).digest("hex")
        role.dbInfo.set('token', token)

        if (role.dbInfo.get("version") != version) {
            // 出现了id相同活动不同的时候，一般不会出现
            role.dbInfo.set("gameInfo", {});
            role.dbInfo.set("gameCount", 0);
            // 忽略错误

            if (role.mailInfos.length > 0) {
                role.newMailIds = [];
                role.mailInfos = [];
                // 忽略错误
                await MongodbMoudle.get_database(DBDefine.db).del(DBDefine.col_mail, { ownerId: role.gameId })
            }
        }

        for (let key in platform) {
            role.dbInfo.set('platform.' + key, platform[key])
        }

        await role.dbInfo.force_save()

        return { code: ErrorCode.ok, role: role.toClinet(), token: token, localTime: LocalDate.now(), lastSaveTime: role.get("lastSaveTime") };
    }

    // 玩家登录失败的消息推送
    private static _loadFailed(reject: (v: { code: number, data?: string }) => void) {
        reject({ code: ErrorCode.login_error });
    }

    // 重新获取玩家信息
    static loadInfo(gameId: string, token: string): Promise<{ code: number, role: any, lastSaveTime: number }> {
        return new Promise(function (resolve, reject) {
            UnitRole.getRole(gameId, token || '')
                .then(function ({ code, role }) {
                    resolve({ code: ErrorCode.ok, role: role.toClinet(), lastSaveTime: role.get("lastSaveTime") })
                }).catch(reject)
        })
    }

    // 给玩家发道具
    static addItem(gameId: string, itemid: string, count: number) {
        // 这里通知给游戏发道具,安全问题,增加一个服务器的限制
        // return UnitRole.giveMail(gameId, gameId, { type: 'systemmail', itemid: itemid, count: count });
        return UnitRole.addItem(gameId, itemid, count);
    }

    // 保存玩家信息saveInfo
    static saveInfo(gameId: string, token: string, gameInfo: string): Promise<{ code: number, lastSaveTime: number }> {
        return new Promise(function (resolve, reject) {
            UnitRole.getRole(gameId, token || '')
                .then(function ({ code, role }) {
                    // 这里记录一个玩家存储了多少次的字段
                    let energy = role.gameInfo.energy || 0;
                    try {
                        role.set("gameInfo", JSON.parse(gameInfo));
                    }
                    catch (e) {
                        role.set("gameInfo", gameInfo);
                    }

                    let nenergy = role.gameInfo.energy || 0;

                    if (energy != nenergy) {
                        LoggerInstance.energyLog(role.gameId, role.uid, nenergy, role.version);
                    }
                    let gamecount = parseInt(role.get("gameCount") || '0');
                    if (isNaN(gamecount) || !gamecount) gamecount = 0;
                    gamecount++;
                    role.set("gameCount", gamecount);
                    role.set("lastSaveTime", LocalDate.now());
                    resolve({ code: ErrorCode.ok, lastSaveTime: role.get("lastSaveTime") });
                })
                .catch(reject);
        })
    }

    // 保存玩家信息saveSingleInfo
    static saveSingleInfo(gameId: string, token: string, gameInfo: string): Promise<{ code: number, lastSaveTime: number }> {
        return new Promise(function (resolve, reject) {
            UnitRole.getRole(gameId, token || '')
                .then(function ({ code, role }) {
                    // 这里记录一个玩家存储了多少次的字段
                    let infoMap: { [key: string]: any } = {};
                    try {
                        infoMap = JSON.parse(gameInfo);
                    }
                    catch (e) {
                        if (typeof gameInfo == "object") {
                            infoMap = gameInfo as any;
                        }
                    }

                    if (Object.keys(infoMap).length == 0) {
                        resolve({ code: ErrorCode.ok, lastSaveTime: role.get("lastSaveTime") });
                    }
                    else {
                        // 设置玩家的单个数据
                        for (let key in infoMap) {
                            if (key == "energy") {
                                LoggerInstance.energyLog(role.gameId, role.uid, infoMap[key], role.version);
                            }

                            role.set('gameInfo.' + key, infoMap[key]);
                        }

                        let gamecount = parseInt(role.get("gameCount") || '0');
                        if (isNaN(gamecount) || !gamecount) gamecount = 0;
                        gamecount++;
                        role.set("gameCount", gamecount);
                        role.set("lastSaveTime", LocalDate.now());
                        resolve({ code: ErrorCode.ok, lastSaveTime: role.get("lastSaveTime") });
                    }
                })
                .catch(reject);
        })
    }

    // 重新加载邮件接口
    static async doReloadMails(gameId: string, token: string) {
        let role = await UnitRole.getRole(gameId, token);
        await role.role.loadMail()
        return Promise.resolve({
            code: ErrorCode.ok,
            newMails: role.role.newMailIds,
            mailInfos: role.role.mailInfos,
        });
    }

    // 发送邮件接口
    static async doGiveMail(gameId: string, token: string, sendId: string, message: string) {
        try {
            message = JSON.parse(message)
        }
        catch (e) {
            return Promise.reject({ code: ErrorCode.param_error, errMsg: "message is error" })
        }

        let role = await UnitRole.getRole(gameId, token);
        // 用户认证成功了，那么就开始发邮件了
        await UnitRole.giveMail(role.role.gameId, sendId, message)
        return Promise.resolve({ code: ErrorCode.ok });
    }

    // 删改邮件接口
    static async doOptMail(gameId: string, token: string, mailId: string, type: string, state: number) {
        if (!state || isNaN(state)) state = 1;
        await UnitRole.getRole(gameId, token);
        switch (type) {
            case 'delete': {
                // 删除邮件
                return UnitRole.delDBMail(gameId, mailId);
            }
            case 'state': {
                // 操作邮件状态
                return UnitRole.updateDBMail(gameId, mailId, state);
            }
        }

        // 用户认证成功了，那么就开始发邮件了
        return Promise.reject({ code: ErrorCode.param_error, errMsg: 'type:[' + type + '] is no useful' });
    }

    // 触发游戏的活动
    static doAction(gameId: string, token: string, actionType: string, actionValue: string, type: string): Promise<{ code: number }> {
        return new Promise(function (resolve, reject) {
            UnitRole.getRole(gameId, token).then(function ({ code, role }) {
                // 判断数据满足了推送
                // 记录到榜单系统中，判断是否需要等级
                switch (actionType) {
                    case "addrank":
                        GameRoleService.addRank(role, actionValue, type).then(resolve).catch(reject);
                        break;
                    case "get4": {
                        GameRoleService.getRank4(role, actionValue, type).then(resolve).catch(reject);
                        break;
                    }
                    case "rankaward": {
                        GameRoleService.rankaward(role, actionValue, type).then(resolve).catch(reject);
                        break;
                    }
                    case "getrange": {
                        GameRoleService.getRankRange(role, actionValue, type).then(resolve).catch(reject);
                        break;
                    }
                    case 'rankinfo': {
                        GameRoleService.getRankActive(role, actionValue, type).then(resolve).catch(reject);
                        break;
                    }
                    case "top3award": {
                        GameRoleService.top3award(role, actionValue, type).then(resolve).catch(reject);
                        break;
                    }
                    default: {
                        reject({ code: ErrorCode.param_error, errMsg: "can not find " + actionType });
                        break;
                    }
                }
            }).catch(reject);
        })
    }

    // 角色信息
    private static unitInfo(role: UnitRole) {
        return Object.assign({ location: role.getLocation() }, role.gameInfo.userinfo || {})
    }

    // 添加排名
    private static async addRank(role: UnitRole, actionValue: string, type: string) {
        let addScore = parseInt(actionValue);
        if (!addScore || isNaN(addScore)) return Promise.reject({ code: ErrorCode.param_error, errMsg: "score is zero" });
        let v = await http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.addrank"), {
            rankId: role.get('version') + "|" + type,
            unitInfo: GameRoleService.unitInfo(role),
            unitId: role.gameId,
            pltId: role.uid,
            score: parseInt(actionValue),
            location: role.getLocation()
        }, 0, null, { request_type: "json" })
        if (v && v.code == 0) {
            return v;
        }
        else {
            return Promise.reject(v);
        }
    }

    // 获取排行
    private static getRank4(role: UnitRole, score: string, type: string): Promise<{ code: number }> {
        return new Promise(function (resolve, reject) {
            http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.getrank4"), {
                rankId: role.get('version') + "|" + type,
                roleId: role.gameId,
                score: score,
                unitInfo: GameRoleService.unitInfo(role),
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        })
    }

    // 排行奖励
    private static rankaward(role: UnitRole, score: string, type: string): Promise<{ code: number }> {
        return new Promise(function (resolve, reject) {
            http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.rankaward"), {
                rankId: role.get('version') + "|" + type,
                roleId: role.gameId,
                score: score,
                unitInfo: GameRoleService.unitInfo(role),
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        })
    }

    // 获取排行列表
    static async getRankList(gameId: string, token: string, sBegin: string, sEnd: string, type: string, score?: string | number): Promise<{ code: number }> {
        if (score != undefined) score = parseInt(score.toString());
        let role: UnitRole = (await UnitRole.getRole(gameId, token)).role

        // 解析 actionValue 提取出开始和结束

        let start = parseInt(sBegin || '0');
        if (!start || isNaN(start)) start = 0;

        let end = parseInt(sEnd || '0');
        if (isNaN(end) || !end) end = 0;

        let length = end - start;
        if (length < 0) {
            if (end != 0) length = 10;
            else length = 0;
        }


        let v = await http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.ranklist"), {
            rankId: role.get('version') + "|" + type, 'unitId': role.gameId,
            start: start,
            len: length,
            selfnode: (score != undefined) ? {
                roleId: role.gameId,
                // 用户平台的id
                pltId: role.uid,
                // 上榜的时间
                time: LocalDate.now(),
                // 角色信息
                unitInfo: this.unitInfo(role),
                // 上榜积分
                score: score
            } : undefined
        }, 0, null, { request_type: "json" })
        if (v && v.code == 0) {
            return v;
        }
        else {
            return Promise.reject(v);
        }

    }

    // 获取历史排行榜
    static async getHisRankList(gameId: string, token: string, sBegin: string, sEnd: string, type: string) {
        let role: UnitRole = (await UnitRole.getRole(gameId, token)).role

        // 解析 actionValue 提取出开始和结束

        let start = parseInt(sBegin || '0');
        if (!start || isNaN(start)) start = 0;

        let end = parseInt(sEnd || '0');
        if (isNaN(end) || !end) end = 0;

        let length = end - start;
        if (length < 0) {
            if (end != 0) length = 10;
            else length = 0;
        }

        let v = await http_quest<{
            code: ErrorCode;
            start: number;
            end: number;
            data: { rankInfos: { roleId: string }[], time: number };
            wait: number;
            self?: any;
            selfIdx: number;
        }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.hisranklist"), {
            rankId: role.get('version') + "|" + type,
            unitId: role.gameId,
            start: start,
            len: length
        }, 0, null, { request_type: "json", respon_type: "json" })
        if (v && v.code == 0) {
            return v;
        }
        else {
            throw (v);
        }
    }

    // 获取区域排行榜
    static async getLocationList(gameId: string, token: string, sBegin: string, sEnd: string, location: string, type: string, score?: string | number): Promise<{ code: number }> {
        if (score != undefined) score = parseInt(score.toString());
        // 解析 actionValue 提取出开始和结束
        let role: UnitRole = (await UnitRole.getRole(gameId, token)).role

        let start = parseInt(sBegin || '0');
        if (!start || isNaN(start)) start = 0;

        let end = parseInt(sEnd || '0');
        if (isNaN(end) || !end) end = 0;

        let length = start - end;
        if (length < 0) length = 10;

        let v = await http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.subrank"), {
            'rankId': role.get('version') + "|" + type, 'unitId': role.gameId,
            'start': start,
            'len': length,
            'sub': location,
            selfnode: (score != undefined) ? {
                roleId: role.gameId,
                // 用户平台的id
                pltId: role.uid,
                // 上榜的时间
                time: LocalDate.now(),
                // 角色信息
                unitInfo: this.unitInfo(role),
                // 上榜积分
                score: score
            } : undefined
        }, 0, null, { request_type: "json" })
        if (v && v.code == 0) {
            return v;
        }
        else {
            return Promise.reject(v);
        }
    }

    // 获取当前积分的排名
    private static getRankRange(role: UnitRole, actionValue: string, type: string): Promise<{ code: number }> {
        return new Promise(function (resolve, reject) {
            http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.getrange"), {
                'rankId': role.get('version') + "|" + type, 'roleId': role.gameId, score: actionValue
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        })
    }

    // 获取活动信息，这个暂时从榜单服务获取，后续考虑从平台服获取
    private static getRankActive(role: UnitRole, actionValue: string, type: string): Promise<{ code: number }> {
        return new Promise(function (resolve, reject) {
            http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.rankinfo"), {
                'rankId': role.get('version') + "|" + type
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        })
    }

    // 获取前三的奖励段最低分
    private static top3award(role: UnitRole, actionValue: string, type: string): Promise<{ code: number }> {
        return new Promise(function (resolve, reject) {
            http_quest<{ code: number }>("post", ConfigMgr.get("rank.url") + ConfigMgr.get("rank.top3award"), {
                'rankId': role.get('version') + "|" + type
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        })
    }

    // 开始单局游戏
    static async startGame(gameId: any, token: any): Promise<any> {
        let ret = await UnitRole.getRole(gameId, token)
        if (!ret || !ret.role) {
            return Promise.reject({ code: ErrorCode.role_no, errMsg: "role is not found!" });
        }

        let role: UnitRole = ret.role;

        //判断次数是否足够
        if (!role.canPlay()) {
            return Promise.reject({ code: ErrorCode.game_start_not_enough_items, errMsg: "role has no enegry!" });
        }

        //生成密钥并保存
        let singleGameLock = createHash("md5").update('' + LocalDate.now + gameId + token + Math.random()).digest('hex');
        role.set("singleGameLock", singleGameLock)

        return Promise.resolve({ code: ErrorCode.ok, singleGameLock: singleGameLock });
    }

    // 单局游戏结算
    static async endGame(gameId: string, token: string, score: number, singleGameLock: String, addScore?: number, level?: number): Promise<any> {
        //对可能传的值初始化一下
        level = level ? level : 0
        addScore = addScore ? addScore : 0

        //获取玩家信息
        let ret = await UnitRole.getRole(gameId, token)
        if (!ret || !ret.role) {
            return Promise.reject({ code: ErrorCode.role_no, errMsg: "role is not found!" });
        }

        let role: UnitRole = ret.role;

        //单局校验
        if (singleGameLock === "" || singleGameLock != role.get('singleGameLock')) {
            return Promise.reject({ code: ErrorCode.param_error, Msg: 'the singleGameLock is wrong!' })
        } else {
            //重置密钥
            role.set("singleGameLock", "")

            // 通知平台服务器发放结算奖励
            let platformResult = await PlatformNet.sendGameResult<{ code: number, score: string }>(role.version, role.uid, gameId, level, addScore, score);
            if (platformResult.code === 0) {

                //获取最高分
                let highestScore = role.get("highestScore") || 0;
                highestScore < score ? highestScore = score : highestScore = highestScore
                role.set("highestScore", highestScore)

                return Promise.resolve({ code: ErrorCode.ok, highestScore: highestScore })
            } else {
                return Promise.reject({ code: ErrorCode.platform_connect_failed, Msg: 'platform connect failed!' })
                console.error(`endgame get platform award fail: gameid[${gameId}] code[${platformResult.code}]`);
            }
        }
    }

    // 获取token信息
    static async getRoleToken(gameId: string) {
        let ret = await UnitRole.getRole(gameId, undefined);
        if (!ret) {
            return Promise.reject({ code: ErrorCode.role_no, errMsg: "role is not found!" });
        }

        let role: UnitRole = ret.role;

        return { code: ErrorCode.ok, token: role.token };
    }

    // 查询道具数量
    static async queryItemCount(gameId: string, token: string, itemId: string): Promise<any> {
        let ret = await UnitRole.getRole(gameId, token);
        if (!ret) {
            return Promise.reject({ code: ErrorCode.role_no, errMsg: "role is not found!" });
        }

        let role: UnitRole = ret.role;

        return Promise.resolve({ code: ErrorCode.ok, itemCount: role.getItemCount(itemId) });
    }
    
}