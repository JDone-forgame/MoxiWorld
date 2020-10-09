"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const crypto_1 = require("crypto");
const mx_tool_1 = require("mx-tool");
const mx_webserve_1 = require("mx-webserve");
const define_1 = require("../../../../defines/define");
const makeGameSing_1 = require("../../../../lib/makeGameSing");
const gameRPC_1 = require("../../../../rpcs/gameRPC");
let game = class game {
    /**
     * 登录回复信息(简略)
     * @type LoginType
     * @param {number} code.query - 0 表示成功
     * @param {Object} role.query - 结构体
     * @param {string} gameId.query - 用户 id
     * @param {any}    gameInfo - any 用户数据
     * @param {number} gameCount - 设置用户 api 使用的次数 0 表示新手
     * @param {any}    weeklyInfo - 用户的每周数据
     * @param {string[]}   newMails - 新邮件的 mailId 调用【阅读或者删除邮件接口】后就会移除新邮件标识
     * @param {any[]}   mailInfos - 邮件数据
     * @param {string}   token - 后续操作使用的认证
    */
    /**
    * 获得 openid 和 unionid 后的登录，确保安全，所以这里采用 wx.login + wx.getAuthInfo 二合一的模式
    * @route POST /game/local/login
    * @group local - 本地接口
    * @param {string} name.query.required - 名字
    * @returns {code:number} 0 - 返回内容
    */
    login(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve, reject) {
                let data = {
                    code: 0,
                    uid: '100001',
                    gameId: crypto_1.createHash('md5').update(param.name).digest('hex'),
                    account: param.name,
                    openid: '',
                    session_key: '',
                    version: param.activeId || '10001',
                };
                gameRPC_1.gameRPC.inst
                    .login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, {})
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    /**
     * 登录信息
     * 返回内容
     * @route POST /game/local/logincheck
     * @group local - 本地接口
     * @param {object} info.query.required - 拉起游戏的时候 sdk 给的验证信息
     * @returns {code:number} 0 - 返回内容
     */
    logincheck(param) {
        if (typeof param.info != 'object') {
            try {
                param.info = JSON.parse(param.info);
            }
            catch (e) {
                return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: `param info is wrong` });
            }
        }
        let info = param.info;
        if (mx_tool_1.ConfigMgr.get("debug.untoken") != true && makeGameSing_1.makeGameSing(info) != info.sign) {
            return Promise.reject({ code: define_1.ErrorCode.login_error, errMsg: "sign is wrong" });
        }
        return new Promise(function (resolve, reject) {
            let data = {
                code: 0,
                uid: info.pltId,
                gameId: info.userId,
                account: info.unionId,
                openid: info.openId,
                session_key: info.session_key,
                version: info.activeId,
                platform: JSON.parse(info.platform || '{}')
            };
            gameRPC_1.gameRPC.inst
                .login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, data.platform)
                .then(resolve)
                .catch(reject);
        });
    }
    /**
     * 获取用户信息
     * @route POST /game/local/getinfo
     * @group local - 本地接口
     * @param {string} gameId.query.required - id
     * @param {string} token.query.required - token
     * @returns {code:number} 0 - 返回内容
     */
    getinfo(param) {
        return gameRPC_1.gameRPC.inst.getInfo(param.gameId, param.token);
    }
    ;
    /**
     * 设置用户信息
     * @route POST /game/local/setinfo
     * @group local - 本地接口
     * @param {string} gameId.query.required - id
     * @param {string} token.query.required - token
     * @param {object} gameInfo.query.required - 设置信息
     * @returns {code:number} 0 - 返回内容
     */
    setinfo(param) {
        return gameRPC_1.gameRPC.inst.setInfo(param.gameId, param.token, param.gameInfo);
    }
    ;
    /**
    * 设置用户信息增量
    * @route POST /game/local/setsingleinfo
    * @group local - 本地接口
    * @param {string} gameId.query.required - 名字
    * @param {string} token.query.required - token
    * @param {object} gameInfo.query.required - 设置信息
    * @returns {code:number} 0 - 返回内容
    */
    setsingleinfo(param) {
        return gameRPC_1.gameRPC.inst.setSingleInfo(param.gameId, param.token, param.gameInfo);
    }
    ;
    /**
    * 加载邮件
    * @route POST /game/local/loadmail
    * @group local - 本地接口
    * @param {string} gameId.query.required - id
    * @param {string} token.query.required - token
    * @param {object} gameInfo.query.required - 设置信息
    * @returns {code:number} 0 - 返回内容
    */
    loadmail(param) {
        return gameRPC_1.gameRPC.inst.loadMails(param.gameId, param.token);
    }
    /**
     * 发送邮件
     * @route POST /game/local/givemail
     * @group local - 本地接口
     * @param {string} gameId.query.required - id
     * @param {string} token.query.required - token
     * @param {string} sendId.query.required - 接收者id
     * @param {string} message.query.required - 消息内容
     * @returns {code:number} 0 - 返回内容
     */
    givemail(param) {
        return gameRPC_1.gameRPC.inst.giveMail(param.gameId, param.token, param.sendId, param.message);
    }
    ;
    /**
    * 操作邮件
    * @route POST /game/local/optmail
    * @group local - 本地接口
    * @param {string} gameId.query.required - id
    * @param {string} token.query.required - token
    * @param {string} mailId.query.required - 邮件id
    * @param {string} type.query.required - 操作类型 -egs:delete,state
    * @param {number} state.query.required - 状态码 type是state时生效
    * @returns {code:number} 0 - 返回内容
    */
    optmail(param) {
        return gameRPC_1.gameRPC.inst.optMail(param.gameId, param.token, param.mailId, param.type, parseInt(param.state));
    }
    ;
    /**
     * 增加每周积分
     * @route POST /game/local/addweeklyscore
     * @group local - 本地接口
     * @param {string} gameId.query.required - id
     * @param {string} token.query.required - token
     * @param {number} score.query.required - 积分
     * @returns {code:number} 0 - 返回内容
     */
    addweeklyscore(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return gameRPC_1.gameRPC.inst.addWeeklyScore(param.gameId, param.token, param.score);
        });
    }
    /**
     * 开始游戏
     * @date 2020-09-24
     * @route POST /game/local/startgame
     * @group game - 活动管理器
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @returns {code:number} 0 - 操作结果
     * @returns {singleGameLock:string} string - 返回的密钥
     */
    startgame(param) {
        return gameRPC_1.gameRPC.inst.startGame(param.gameId, param.token);
    }
    /**
     * 结算游戏
     * @date 2020-09-24
     * @route POST /game/local/endgame
     * @group game - 活动管理器
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {number} score.query.required - score
     * @param {string} singleGameLock.query.required - 单局密钥
     * @param {number} addScore - 添加分数（可不传）
     * @param {number} level - level（可不传）
     * @returns {code:number} 0 - 操作结果
     * @returns {highestScore:number} number - 历史最高分数
     */
    endgame(param) {
        return gameRPC_1.gameRPC.inst.endGame(param.gameId, param.token, param.score, param.singleGameLock);
    }
    /**
     * 查询道具数量
     * @date 2020-09-29
     * @route POST /game/local/queryItemCount
     * @group game - 活动管理器
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} itemId.query.required - itemId
     * @returns { code: number} 0 - 操作结果
     */
    queryitemcount(param) {
        return gameRPC_1.gameRPC.inst.queryItemCount(param.gameId, param.token, param.itemId);
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("name", "string", true)
], game.prototype, "login", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("info", "object", true)
], game.prototype, "logincheck", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true)
], game.prototype, "getinfo", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("gameInfo", "object", true)
], game.prototype, "setinfo", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("gameInfo", "object", true)
], game.prototype, "setsingleinfo", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true)
], game.prototype, "loadmail", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("sendId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("message", "string", true)
], game.prototype, "givemail", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("mailId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("type", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("state", "number", true)
], game.prototype, "optmail", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("score", "number", true)
], game.prototype, "addweeklyscore", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true)
], game.prototype, "startgame", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("score", "number", true),
    mx_webserve_1.WebRouteModule.paramRequired("singleGameLock", "string", true)
], game.prototype, "endgame", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("gameId", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("token", "string", true),
    mx_webserve_1.WebRouteModule.paramRequired("itemId", "string", true)
], game.prototype, "queryitemcount", null);
game = __decorate([
    mx_webserve_1.WebRouteModule.class(module)
], game);
//# sourceMappingURL=local.js.map