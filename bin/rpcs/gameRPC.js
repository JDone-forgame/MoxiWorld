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
     * @param {any} platform platform
     */
    login(gameId, uid, unionid, openid, sessionKey, version, platform) {
        let query = {
            gameId: gameId,
            uid: uid,
            unionid: unionid,
            openid: openid,
            sessionKey: sessionKey,
            version: version,
            platform: platform
        };
        let body = {};
        return this.request("request", "login", Object.assign(query, body), "gameId,uid,unionid,openid,sessionKey,version,platform".split(","), "gameId");
    }
    /**
     *
获取用户信息
     * @param {string} gameId 玩家id
     * @param {string} token token
     */
    getInfo(gameId, token) {
        let query = {
            gameId: gameId,
            token: token
        };
        let body = {};
        return this.request("request", "getInfo", Object.assign(query, body), "gameId,token".split(","), "gameId");
    }
    /**
     *
设置用户信息
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {string} gameInfo gameInfo
     */
    setInfo(gameId, token, gameInfo) {
        let query = {
            gameId: gameId,
            token: token,
            gameInfo: gameInfo
        };
        let body = {};
        return this.request("request", "setInfo", Object.assign(query, body), "gameId,token,gameInfo".split(","), "gameId");
    }
    /**
     *
设置用户信息增量设置
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {string} gameInfo gameInfo
     */
    setSingleInfo(gameId, token, gameInfo) {
        let query = {
            gameId: gameId,
            token: token,
            gameInfo: gameInfo
        };
        let body = {};
        return this.request("request", "setSingleInfo", Object.assign(query, body), "gameId,token,gameInfo".split(","), "gameId");
    }
    /**
     *
加载邮件
     * @param {string} gameId 玩家id
     * @param {string} token token
     */
    loadMails(gameId, token) {
        let query = {
            gameId: gameId,
            token: token
        };
        let body = {};
        return this.request("request", "loadMails", Object.assign(query, body), "gameId,token".split(","), "gameId");
    }
    /**
     *
发送邮件
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {string} sendId 收件人
     * @param {string} message 消息
     */
    giveMail(gameId, token, sendId, message) {
        let query = {
            gameId: gameId,
            token: token,
            sendId: sendId,
            message: message
        };
        let body = {};
        return this.request("request", "giveMail", Object.assign(query, body), "gameId,token,sendId,message".split(","), "gameId");
    }
    /**
     *
操作邮件
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {string} mailId mailId
     * @param {string} type 操作类型 -egs:delete,state
     * @param {number} state 状态码 type是state时生效
     */
    optMail(gameId, token, mailId, type, state) {
        let query = {
            gameId: gameId,
            token: token,
            mailId: mailId,
            type: type,
            state: state
        };
        let body = {};
        return this.request("request", "optMail", Object.assign(query, body), "gameId,token,mailId,type,state".split(","), "gameId");
    }
    /**
     *
增加每周数据
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {string} score score
     */
    addWeeklyScore(gameId, token, score) {
        let query = {
            gameId: gameId,
            token: token,
            score: score
        };
        let body = {};
        return this.request("request", "addWeeklyScore", Object.assign(query, body), "gameId,token,score".split(","), "gameId");
    }
    /**
     *
开始游戏
     * @param {string} gameId 玩家id
     * @param {string} token token
     */
    startGame(gameId, token) {
        let query = {
            gameId: gameId,
            token: token
        };
        let body = {};
        return this.request("request", "startGame", Object.assign(query, body), "gameId,token".split(","), "gameId");
    }
    /**
     *
结算游戏
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {number} score score
     * @param {string} singleGameLock 单局密钥
     * @param {number} addScore 添加分数（可不传）
     * @param {number} level level（可不传）
     */
    endGame(gameId, token, score, singleGameLock, addScore, level) {
        let query = {
            gameId: gameId,
            token: token,
            score: score,
            singleGameLock: singleGameLock
        };
        let body = {
            addScore: addScore,
            level: level
        };
        return this.request("request", "endGame", Object.assign(query, body), "gameId,token,score,singleGameLock,addScore,level".split(","), "gameId");
    }
    /**
     *
获取角色token信息(主要用于服务器内部调用)
     * @param {string} gameId 玩家id
     */
    getRoleToken(gameId) {
        let query = {
            gameId: gameId
        };
        let body = {};
        return this.request("request", "getRoleToken", Object.assign(query, body), "gameId".split(","), "gameId");
    }
    /**
     *
查询道具数量
     * @param {string} gameId 玩家id
     * @param {string} token token
     * @param {string} itemId itemId
     */
    queryItemCount(gameId, token, itemId) {
        let query = {
            gameId: gameId,
            token: token,
            itemId: itemId
        };
        let body = {};
        return this.request("request", "queryItemCount", Object.assign(query, body), "gameId,token,itemId".split(","), "gameId");
    }
    /**
     *
添加游戏道具
     * @param {string} gameId 玩家id
     * @param {string} itemId itemId
     * @param {number} count token
     */
    addItem(gameId, itemId, count) {
        let query = {
            gameId: gameId,
            itemId: itemId,
            count: count
        };
        let body = {};
        return this.request("request", "addItem", Object.assign(query, body), "gameId,itemId,count".split(","), "gameId");
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