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
exports.GameRoleService = void 0;
const crypto_1 = require("crypto");
const mx_tool_1 = require("mx-tool");
const mx_database_1 = require("mx-database");
const define_1 = require("../../../defines/define");
const logger_1 = require("../../../lib/logger");
const role_1 = require("./role");
const platformNet_1 = require("../../../lib/platformNet");
class GameRoleService {
    static init() {
        return role_1.UnitRole.init();
    }
    // 登录
    static login(gameId, uid, unionid, openid, session_key, version, platform = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                role_1.UnitRole.getRole(gameId).then(function (data) {
                    GameRoleService._loadSucc(gameId, data.role, version, platform).then(resolve).catch(e => {
                        reject({ code: define_1.ErrorCode.db_error, errMsg: "db is error" });
                    });
                }).catch(e => {
                    if (e.code == define_1.ErrorCode.role_no) {
                        role_1.UnitRole.registRole(gameId, uid, unionid, openid, session_key, version).then(data => {
                            GameRoleService._loadSucc(gameId, data.role, version, platform).then(resolve).catch(e => {
                                reject({ code: define_1.ErrorCode.db_error, errMsg: "db is error" });
                            });
                        });
                    }
                    else {
                        // 失败的时候
                        GameRoleService._loadFailed(reject);
                    }
                });
            });
        });
    }
    // 玩家登录成功后的消息推送
    static _loadSucc(gameId, role, version, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            // 提取出用信息推送
            // 需要设置用户一个token 后续通过token来判断登录状态
            let token = crypto_1.createHash("md5").update('' + Date.now() + gameId + role.session_key).digest("hex");
            role.dbInfo.set('token', token);
            if (role.dbInfo.get("version") != version) {
                // 出现了id相同活动不同的时候，一般不会出现
                role.dbInfo.set("gameInfo", {});
                role.dbInfo.set("gameCount", 0);
                // 忽略错误
                if (role.mailInfos.length > 0) {
                    role.newMailIds = [];
                    role.mailInfos = [];
                    // 忽略错误
                    yield mx_database_1.MongodbMoudle.get_database(define_1.DBDefine.db).del(define_1.DBDefine.col_mail, { ownerId: role.gameId });
                }
            }
            for (let key in platform) {
                role.dbInfo.set('platform.' + key, platform[key]);
            }
            yield role.dbInfo.force_save();
            return { code: define_1.ErrorCode.ok, role: role.toClinet(), token: token, localTime: mx_tool_1.LocalDate.now(), lastSaveTime: role.get("lastSaveTime") };
        });
    }
    // 玩家登录失败的消息推送
    static _loadFailed(reject) {
        reject({ code: define_1.ErrorCode.login_error });
    }
    // 重新获取玩家信息
    static loadInfo(gameId, token) {
        return new Promise(function (resolve, reject) {
            role_1.UnitRole.getRole(gameId, token || '')
                .then(function ({ code, role }) {
                resolve({ code: define_1.ErrorCode.ok, role: role.toClinet(), lastSaveTime: role.get("lastSaveTime") });
            }).catch(reject);
        });
    }
    // 给玩家发道具
    static addItem(gameId, itemid, count) {
        // 这里通知给游戏发道具,安全问题,增加一个服务器的限制
        // return UnitRole.giveMail(gameId, gameId, { type: 'systemmail', itemid: itemid, count: count });
        return role_1.UnitRole.addItem(gameId, itemid, count);
    }
    // 保存玩家信息saveInfo
    static saveInfo(gameId, token, gameInfo) {
        return new Promise(function (resolve, reject) {
            role_1.UnitRole.getRole(gameId, token || '')
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
                    logger_1.LoggerInstance.energyLog(role.gameId, role.uid, nenergy, role.version);
                }
                let gamecount = parseInt(role.get("gameCount") || '0');
                if (isNaN(gamecount) || !gamecount)
                    gamecount = 0;
                gamecount++;
                role.set("gameCount", gamecount);
                role.set("lastSaveTime", mx_tool_1.LocalDate.now());
                resolve({ code: define_1.ErrorCode.ok, lastSaveTime: role.get("lastSaveTime") });
            })
                .catch(reject);
        });
    }
    // 保存玩家信息saveSingleInfo
    static saveSingleInfo(gameId, token, gameInfo) {
        return new Promise(function (resolve, reject) {
            role_1.UnitRole.getRole(gameId, token || '')
                .then(function ({ code, role }) {
                // 这里记录一个玩家存储了多少次的字段
                let infoMap = {};
                try {
                    infoMap = JSON.parse(gameInfo);
                }
                catch (e) {
                    if (typeof gameInfo == "object") {
                        infoMap = gameInfo;
                    }
                }
                if (Object.keys(infoMap).length == 0) {
                    resolve({ code: define_1.ErrorCode.ok, lastSaveTime: role.get("lastSaveTime") });
                }
                else {
                    // 设置玩家的单个数据
                    for (let key in infoMap) {
                        if (key == "energy") {
                            logger_1.LoggerInstance.energyLog(role.gameId, role.uid, infoMap[key], role.version);
                        }
                        role.set('gameInfo.' + key, infoMap[key]);
                    }
                    let gamecount = parseInt(role.get("gameCount") || '0');
                    if (isNaN(gamecount) || !gamecount)
                        gamecount = 0;
                    gamecount++;
                    role.set("gameCount", gamecount);
                    role.set("lastSaveTime", mx_tool_1.LocalDate.now());
                    resolve({ code: define_1.ErrorCode.ok, lastSaveTime: role.get("lastSaveTime") });
                }
            })
                .catch(reject);
        });
    }
    // 重新加载邮件接口
    static doReloadMails(gameId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield role_1.UnitRole.getRole(gameId, token);
            yield role.role.loadMail();
            return Promise.resolve({
                code: define_1.ErrorCode.ok,
                newMails: role.role.newMailIds,
                mailInfos: role.role.mailInfos,
            });
        });
    }
    // 发送邮件接口
    static doGiveMail(gameId, token, sendId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                message = JSON.parse(message);
            }
            catch (e) {
                return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: "message is error" });
            }
            let role = yield role_1.UnitRole.getRole(gameId, token);
            // 用户认证成功了，那么就开始发邮件了
            yield role_1.UnitRole.giveMail(role.role.gameId, sendId, message);
            return Promise.resolve({ code: define_1.ErrorCode.ok });
        });
    }
    // 删改邮件接口
    static doOptMail(gameId, token, mailId, type, state) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!state || isNaN(state))
                state = 1;
            yield role_1.UnitRole.getRole(gameId, token);
            switch (type) {
                case 'delete': {
                    // 删除邮件
                    return role_1.UnitRole.delDBMail(gameId, mailId);
                }
                case 'state': {
                    // 操作邮件状态
                    return role_1.UnitRole.updateDBMail(gameId, mailId, state);
                }
            }
            // 用户认证成功了，那么就开始发邮件了
            return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: 'type:[' + type + '] is no useful' });
        });
    }
    // 触发游戏的活动
    static doAction(gameId, token, actionType, actionValue, type) {
        return new Promise(function (resolve, reject) {
            role_1.UnitRole.getRole(gameId, token).then(function ({ code, role }) {
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
                        reject({ code: define_1.ErrorCode.param_error, errMsg: "can not find " + actionType });
                        break;
                    }
                }
            }).catch(reject);
        });
    }
    // 角色信息
    static unitInfo(role) {
        return Object.assign({ location: role.getLocation() }, role.gameInfo.userinfo || {});
    }
    // 添加排名
    static addRank(role, actionValue, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let addScore = parseInt(actionValue);
            if (!addScore || isNaN(addScore))
                return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: "score is zero" });
            let v = yield mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.addrank"), {
                rankId: role.get('version') + "|" + type,
                unitInfo: GameRoleService.unitInfo(role),
                unitId: role.gameId,
                pltId: role.uid,
                score: parseInt(actionValue),
                location: role.getLocation()
            }, 0, null, { request_type: "json" });
            if (v && v.code == 0) {
                return v;
            }
            else {
                return Promise.reject(v);
            }
        });
    }
    // 获取排行
    static getRank4(role, score, type) {
        return new Promise(function (resolve, reject) {
            mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.getrank4"), {
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
        });
    }
    // 排行奖励
    static rankaward(role, score, type) {
        return new Promise(function (resolve, reject) {
            mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.rankaward"), {
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
        });
    }
    // 获取排行列表
    static getRankList(gameId, token, sBegin, sEnd, type, score) {
        return __awaiter(this, void 0, void 0, function* () {
            if (score != undefined)
                score = parseInt(score.toString());
            let role = (yield role_1.UnitRole.getRole(gameId, token)).role;
            // 解析 actionValue 提取出开始和结束
            let start = parseInt(sBegin || '0');
            if (!start || isNaN(start))
                start = 0;
            let end = parseInt(sEnd || '0');
            if (isNaN(end) || !end)
                end = 0;
            let length = end - start;
            if (length < 0) {
                if (end != 0)
                    length = 10;
                else
                    length = 0;
            }
            let v = yield mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.ranklist"), {
                rankId: role.get('version') + "|" + type, 'unitId': role.gameId,
                start: start,
                len: length,
                selfnode: (score != undefined) ? {
                    roleId: role.gameId,
                    // 用户平台的id
                    pltId: role.uid,
                    // 上榜的时间
                    time: mx_tool_1.LocalDate.now(),
                    // 角色信息
                    unitInfo: this.unitInfo(role),
                    // 上榜积分
                    score: score
                } : undefined
            }, 0, null, { request_type: "json" });
            if (v && v.code == 0) {
                return v;
            }
            else {
                return Promise.reject(v);
            }
        });
    }
    // 获取历史排行榜
    static getHisRankList(gameId, token, sBegin, sEnd, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = (yield role_1.UnitRole.getRole(gameId, token)).role;
            // 解析 actionValue 提取出开始和结束
            let start = parseInt(sBegin || '0');
            if (!start || isNaN(start))
                start = 0;
            let end = parseInt(sEnd || '0');
            if (isNaN(end) || !end)
                end = 0;
            let length = end - start;
            if (length < 0) {
                if (end != 0)
                    length = 10;
                else
                    length = 0;
            }
            let v = yield mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.hisranklist"), {
                rankId: role.get('version') + "|" + type,
                unitId: role.gameId,
                start: start,
                len: length
            }, 0, null, { request_type: "json", respon_type: "json" });
            if (v && v.code == 0) {
                return v;
            }
            else {
                throw (v);
            }
        });
    }
    // 获取区域排行榜
    static getLocationList(gameId, token, sBegin, sEnd, location, type, score) {
        return __awaiter(this, void 0, void 0, function* () {
            if (score != undefined)
                score = parseInt(score.toString());
            // 解析 actionValue 提取出开始和结束
            let role = (yield role_1.UnitRole.getRole(gameId, token)).role;
            let start = parseInt(sBegin || '0');
            if (!start || isNaN(start))
                start = 0;
            let end = parseInt(sEnd || '0');
            if (isNaN(end) || !end)
                end = 0;
            let length = start - end;
            if (length < 0)
                length = 10;
            let v = yield mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.subrank"), {
                'rankId': role.get('version') + "|" + type, 'unitId': role.gameId,
                'start': start,
                'len': length,
                'sub': location,
                selfnode: (score != undefined) ? {
                    roleId: role.gameId,
                    // 用户平台的id
                    pltId: role.uid,
                    // 上榜的时间
                    time: mx_tool_1.LocalDate.now(),
                    // 角色信息
                    unitInfo: this.unitInfo(role),
                    // 上榜积分
                    score: score
                } : undefined
            }, 0, null, { request_type: "json" });
            if (v && v.code == 0) {
                return v;
            }
            else {
                return Promise.reject(v);
            }
        });
    }
    // 获取当前积分的排名
    static getRankRange(role, actionValue, type) {
        return new Promise(function (resolve, reject) {
            mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.getrange"), {
                'rankId': role.get('version') + "|" + type, 'roleId': role.gameId, score: actionValue
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        });
    }
    // 获取活动信息，这个暂时从榜单服务获取，后续考虑从平台服获取
    static getRankActive(role, actionValue, type) {
        return new Promise(function (resolve, reject) {
            mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.rankinfo"), {
                'rankId': role.get('version') + "|" + type
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        });
    }
    // 获取前三的奖励段最低分
    static top3award(role, actionValue, type) {
        return new Promise(function (resolve, reject) {
            mx_tool_1.http_quest("post", mx_tool_1.ConfigMgr.get("rank.url") + mx_tool_1.ConfigMgr.get("rank.top3award"), {
                'rankId': role.get('version') + "|" + type
            }, 0, null, { request_type: "json" }).then(function (v) {
                if (v && v.code == 0) {
                    resolve(v);
                }
                else {
                    reject(v);
                }
            }).catch(reject);
        });
    }
    // 开始单局游戏
    static startGame(gameId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield role_1.UnitRole.getRole(gameId, token);
            if (!ret || !ret.role) {
                return Promise.reject({ code: define_1.ErrorCode.role_no, errMsg: "role is not found!" });
            }
            let role = ret.role;
            //判断次数是否足够
            if (!role.canPlay()) {
                return Promise.reject({ code: define_1.ErrorCode.game_start_not_enough_items, errMsg: "role has no enegry!" });
            }
            //生成密钥并保存
            let singleGameLock = crypto_1.createHash("md5").update('' + mx_tool_1.LocalDate.now + gameId + token + Math.random()).digest('hex');
            role.set("singleGameLock", singleGameLock);
            return Promise.resolve({ code: define_1.ErrorCode.ok, singleGameLock: singleGameLock });
        });
    }
    // 单局游戏结算
    static endGame(gameId, token, score, singleGameLock, addScore, level) {
        return __awaiter(this, void 0, void 0, function* () {
            //对可能传的值初始化一下
            level = level ? level : 0;
            addScore = addScore ? addScore : 0;
            //获取玩家信息
            let ret = yield role_1.UnitRole.getRole(gameId, token);
            if (!ret || !ret.role) {
                return Promise.reject({ code: define_1.ErrorCode.role_no, errMsg: "role is not found!" });
            }
            let role = ret.role;
            //单局校验
            if (singleGameLock === "" || singleGameLock != role.get('singleGameLock')) {
                return Promise.reject({ code: define_1.ErrorCode.param_error, Msg: 'the singleGameLock is wrong!' });
            }
            else {
                //重置密钥
                role.set("singleGameLock", "");
                // 通知平台服务器发放结算奖励
                let platformResult = yield platformNet_1.PlatformNet.sendGameResult(role.version, role.uid, gameId, level, addScore, score);
                if (platformResult.code === 0) {
                    //获取最高分
                    let highestScore = role.get("highestScore") || 0;
                    highestScore < score ? highestScore = score : highestScore = highestScore;
                    role.set("highestScore", highestScore);
                    return Promise.resolve({ code: define_1.ErrorCode.ok, highestScore: highestScore });
                }
                else {
                    return Promise.reject({ code: define_1.ErrorCode.platform_connect_failed, Msg: 'platform connect failed!' });
                    console.error(`endgame get platform award fail: gameid[${gameId}] code[${platformResult.code}]`);
                }
            }
        });
    }
    // 获取token信息
    static getRoleToken(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield role_1.UnitRole.getRole(gameId, undefined);
            if (!ret) {
                return Promise.reject({ code: define_1.ErrorCode.role_no, errMsg: "role is not found!" });
            }
            let role = ret.role;
            return { code: define_1.ErrorCode.ok, token: role.token };
        });
    }
    // 查询道具数量
    static queryItemCount(gameId, token, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield role_1.UnitRole.getRole(gameId, token);
            if (!ret) {
                return Promise.reject({ code: define_1.ErrorCode.role_no, errMsg: "role is not found!" });
            }
            let role = ret.role;
            return Promise.resolve({ code: define_1.ErrorCode.ok, itemCount: role.getItemCount(itemId) });
        });
    }
}
exports.GameRoleService = GameRoleService;
//# sourceMappingURL=index.js.map