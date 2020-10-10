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
const mx_rpc_1 = require("mx-rpc");
const define_1 = require("../../defines/define");
const gamerole_1 = require("./gamerole");
const role_1 = require("./gamerole/role");
let game = class game {
    init() {
        gamerole_1.GameRoleService.init();
        return true;
    }
    /**
     * 登陆游戏
     * @route request login
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} uid.query.required - 数字id
     * @param {string} unionid.query.required - unionid
     * @param {string} openid.query.required - openid
     * @param {string} session_key.query.required - sessionkey
     * @param {string} version.query.required - 版本
     * @param {any} platform.query.required - platform
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    login(gameId, uid, unionid, openid, session_key, version, platform) {
        return gamerole_1.GameRoleService.login(gameId, uid, unionid, openid, session_key, version, platform);
    }
    /**
     * 获取用户信息
     * @route request getInfo
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    getInfo(gameId, token) {
        return gamerole_1.GameRoleService.loadInfo(gameId, token);
    }
    /**
     * 设置用户信息
     * @route request setInfo
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} gameInfo.query.required - gameInfo
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    setInfo(gameId, token, gameInfo) {
        return gamerole_1.GameRoleService.saveInfo(gameId, token, gameInfo);
    }
    /**
     * 设置用户信息增量设置
     * @route request setSingleInfo
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} gameInfo.query.required - gameInfo
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    setSingleInfo(gameId, token, gameInfo) {
        return gamerole_1.GameRoleService.saveSingleInfo(gameId, token, gameInfo);
    }
    /**
     * 加载邮件
     * @route request loadMails
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    loadMails(gameId, token) {
        return gamerole_1.GameRoleService.doReloadMails(gameId, token);
    }
    /**
     * 发送邮件
     * @route request giveMail
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} sendId.query.required - 收件人
     * @param {string} message.query.required - 消息
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    giveMail(gameId, token, sendId, message) {
        return gamerole_1.GameRoleService.doGiveMail(gameId, token, sendId, message);
    }
    /**
     * 操作邮件
     * @route request optMail
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} mailId.query.required - mailId
     * @param {string} type.query.required - 操作类型 -egs:delete,state
     * @param {number} state.query.required - 状态码 type是state时生效
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    optMail(gameId, token, mailId, type, state) {
        return gamerole_1.GameRoleService.doOptMail(gameId, token, mailId, type, state);
    }
    /**
     * 增加每周数据
     * @route request addWeeklyScore
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} score.query.required - score
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    addWeeklyScore(gameId, token, score) {
        return __awaiter(this, void 0, void 0, function* () {
            let { code, role } = yield role_1.UnitRole.getRole(gameId, token);
            let newScore = role.addWeeklyScore(parseInt(score));
            // 这里抄送排行榜服务器
            try {
                yield gamerole_1.GameRoleService.doAction(gameId, token, "addrank", newScore.toString(), "R002");
            }
            catch (e) {
            }
            return { code: define_1.ErrorCode.ok, score: newScore };
        });
    }
    /**
     * 开始游戏
     * @route request startGame
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @returns {code:number} 0 - 操作结果
     * @returns {singleGameLock:string} string - 返回的密钥
     */
    startGame(gameId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return gamerole_1.GameRoleService.startGame(gameId, token);
        });
    }
    /**
     * 结算游戏
     * @route request endGame
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {number} score.query.required - score
     * @param {string} singleGameLock.query.required - 单局密钥
     * @param {number} addScore - 添加分数（可不传）
     * @param {number} level - level（可不传）
     * @returns {code:number} 0 - 操作结果
     * @returns {highestScore:number} number - 历史最高分数
     */
    endGame(gameId, token, score, singleGameLock) {
        return __awaiter(this, void 0, void 0, function* () {
            return gamerole_1.GameRoleService.endGame(gameId, token, score, singleGameLock);
        });
    }
    /**
     * 获取角色token信息(主要用于服务器内部调用)
     * @route request getRoleToken
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @returns {{code: ErrorCode, token: string}} 0 - 角色信息
     */
    getRoleToken(gameId, token) {
        return gamerole_1.GameRoleService.getRoleToken(gameId);
    }
    /**
     * 查询道具数量
     * @route request queryItemCount
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} token.query.required - token
     * @param {string} itemId.query.required - itemId
     * @returns {{code: ErrorCode}} 0 - 角色信息
     */
    queryItemCount(gameId, token, itemId) {
        return gamerole_1.GameRoleService.queryItemCount(gameId, token, itemId);
    }
    /**
     * 添加游戏道具
     * @route request addItem
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} itemId.query.required - itemId
     * @param {number} count.query.required - token
     * @returns {{code: ErrorCode}} 0 - 角色信息
     */
    addItem(gameId, itemId, count) {
        return gamerole_1.GameRoleService.addItem(gameId, itemId, count);
    }
};
__decorate([
    mx_rpc_1.RPCHandle.init()
], game.prototype, "init", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "login", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "getInfo", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "setInfo", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "setSingleInfo", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "loadMails", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "giveMail", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "optMail", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "addWeeklyScore", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "startGame", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "endGame", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "getRoleToken", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "queryItemCount", null);
__decorate([
    mx_rpc_1.RPCHandle.route()
], game.prototype, "addItem", null);
game = __decorate([
    mx_rpc_1.RPCHandle.class('game', module)
], game);
//# sourceMappingURL=index.js.map