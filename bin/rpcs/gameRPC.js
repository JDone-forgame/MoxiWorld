"use strict";
/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */
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
exports.gameRPC = void 0;
const nodesocket_1 = require("./nodesocket");
class localgameRPC extends nodesocket_1.RequestRPC {
    /**
     *
登陆游戏
     * @param {string} gameId 玩家id
     * @param {string} uid 数字id
     * @param {string} unionid unionid
     * @param {string} openid openid
     * @param {string} sessionKey sessionkey
     * @param {string} version 版本
     * @param {string} inviterId 邀请id
     * @param {string} nickName 昵称
     * @param {string} avatarUrl 头像
     * @param {string} activityId 活动id
     * @param {number} activityStartTime 开始时间
     * @param {number} activityEndTime 结束时间
     */
    login(gameId, uid, unionid, openid, sessionKey, version, inviterId, nickName, avatarUrl, activityId, activityStartTime, activityEndTime) {
        let query = {
            gameId: gameId,
            uid: uid,
            unionid: unionid,
            openid: openid,
            sessionKey: sessionKey,
            version: version,
            inviterId: inviterId,
            nickName: nickName,
            avatarUrl: avatarUrl,
            activityId: activityId,
            activityStartTime: activityStartTime,
            activityEndTime: activityEndTime
        };
        let body = {};
        return this.request("request", "login", Object.assign(query, body), "gameId,uid,unionid,openid,sessionKey,version,inviterId,nickName,avatarUrl,activityId,activityStartTime,activityEndTime".split(","), "gameId");
    }
    /**
     *
从内存中移除角色数据
     * @param {string} gameId 玩家id
     */
    bcRemoveRole(gameId) {
        let query = {
            gameId: gameId
        };
        let body = {};
        return this.request("broadcast", "bcRemoveRole", Object.assign(query, body), "gameId".split(","), "gameId");
    }
}
class gameRPC {
    static rpc_init(srv) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._inst)
                this._inst = new localgameRPC("game", srv);
            return true;
        });
    }
    static get inst() {
        if (!this._inst)
            throw ("need call rpc_init first game");
        return this._inst;
    }
}
exports.gameRPC = gameRPC;
//# sourceMappingURL=gameRPC.js.map