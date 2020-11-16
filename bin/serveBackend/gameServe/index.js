"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mx_rpc_1 = require("mx-rpc");
const gamerole_1 = require("./gamerole");
let game = class game {
    init() {
        gamerole_1.GameRoleService.init();
        return true;
    }
    /**
     * 登陆游戏
     * @route request login
     * @group game - 游戏模块
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @param {string} uid.query.required - 数字id
     * @param {string} unionid.query.required - unionid
     * @param {string} openid.query.required - openid
     * @param {string} session_key.query.required - sessionkey
     * @param {string} version.query.required - 版本
     * @param {string} inviterId.query.required - 邀请id
     * @param {string} nickName.query - 昵称
     * @param {string} avatarUrl.query - 头像
     * @param {string} activityId.query - 活动id
     * @param {number} activityStartTime.query - 开始时间
     * @param {number} activityEndTime.query - 结束时间
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    login(gameId, uid, unionid, openid, session_key, version, inviterId, nickName = "", avatarUrl = "", activityId = "", activityStartTime = 0, activityEndTime = 0) {
        return gamerole_1.GameRoleService.login(gameId, uid, unionid, openid, session_key, version, inviterId, nickName, avatarUrl, activityId, activityStartTime, activityEndTime);
    }
    /**
     * 从内存中移除角色数据
     * @route broadcast bcRemoveRole
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @returns {{code: ErrorCode}} 0 - 返回信息
     */
    bcRemoveRole(gameId) {
        gamerole_1.GameRoleService.removeRole(gameId);
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
], game.prototype, "bcRemoveRole", null);
game = __decorate([
    mx_rpc_1.RPCHandle.class('game', module)
], game);
//# sourceMappingURL=index.js.map