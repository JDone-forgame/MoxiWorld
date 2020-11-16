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
const mx_webserve_1 = require("mx-webserve");
const define_1 = require("../../../../defines/define");
const makeGameSing_1 = require("../../../../lib/makeGameSing");
const gameRPC_1 = require("../../../../rpcs/gameRPC");
let game = class game {
    /**
    * 登录(测试用)
    * @route POST /game/local/login
    * @group login - 登录模块
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
                    version: param.activeId || 'test',
                };
                gameRPC_1.gameRPC.inst
                    .login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, 'inviterId', "nickname", "avatar", 'test', 0, 10)
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    /**
     * 登录检查(正式项目使用)
     * @route POST /game/local/loginCheck
     * @group login - 登录模块
     * @param {object} info.query.required - 拉起游戏的时候 sdk 给的验证信息
     * @returns {code:number} 0 - 返回内容
     */
    loginCheck(param) {
        // 这一块需要平台提供
        let info = param.info;
        if (makeGameSing_1.makeGameSing(info) != info.sign) {
            throw ({ code: define_1.ErrorCode.login_error, errMsg: "sign is wrong" });
        }
        let data = {
            code: 0,
            uid: info.pltId,
            gameId: info.userId,
            account: info.unionId,
            openid: info.openId,
            session_key: info.session_key,
            version: info.activeId,
        };
        return gameRPC_1.gameRPC.inst.login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, param.inviterId, info.nickname || "", info.avatar, info.activeId, info.startTime, info.endTime);
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("name", "string", true)
], game.prototype, "login", null);
__decorate([
    mx_webserve_1.WebRouteModule.route(),
    mx_webserve_1.WebRouteModule.paramRequired("info", "object", true)
], game.prototype, "loginCheck", null);
game = __decorate([
    mx_webserve_1.WebRouteModule.class(module)
], game);
//# sourceMappingURL=local.js.map