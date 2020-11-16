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
const define_1 = require("../../../defines/define");
const role_1 = require("./role");
class GameRoleService {
    static init() {
        return role_1.UnitRole.init();
    }
    /**------------------------------------------------------通用函数------------------------------------------------------------- */
    // 登录
    static login(gameId, uid, unionid, openid, session_key, version, inviterId, nickName = "", avatarUrl = "", activityId = "", activityStartTime = 0, activityEndTime = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            nickName = nickName ? nickName : "";
            avatarUrl = avatarUrl ? avatarUrl : "";
            activityId = activityId ? activityId : "";
            activityStartTime = activityStartTime ? activityStartTime : 0;
            activityEndTime = activityEndTime ? activityEndTime : 0;
            try {
                let data = yield role_1.UnitRole.getRole(gameId);
                // 更新seesionKey
                data.role.session_key = session_key;
                // 更新头像是昵称
                if (nickName !== "") {
                    data.role.nickName = nickName;
                }
                if (avatarUrl !== "") {
                    data.role.avatarUrl = avatarUrl;
                }
                // 更新活动时间数据
                data.role.activityId = activityId;
                data.role.activityStartTime = activityStartTime;
                data.role.activityEndTime = activityEndTime;
                return GameRoleService._loadSucc(gameId, data.role, version, inviterId);
            }
            catch (e) {
                if (e.code == define_1.ErrorCode.role_no) {
                    let data = yield role_1.UnitRole.registRole(gameId, uid, unionid, openid, session_key, version, inviterId, nickName, avatarUrl, activityId, activityStartTime, activityEndTime);
                    return GameRoleService._loadSucc(gameId, data.role, version, inviterId);
                }
                else {
                    // 失败的时候
                    throw ({ code: define_1.ErrorCode.login_error, errMsg: e.errMsg || e.message || "" });
                }
            }
        });
    }
    // 玩家登录成功后的消息推送
    static _loadSucc(gameId, role, version, inviterId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 设置一个token 后续通过token来判断登录状态
            let token = crypto_1.createHash("md5").update('' + Date.now() + gameId + role.session_key).digest("hex");
            role.dbInfo.set('token', token);
            try {
                yield role.dbInfo.force_save();
            }
            catch (e) {
                console.error('_loadSucc', e);
                throw { code: define_1.ErrorCode.db_error, errMsg: "db is error" };
            }
            // 登录前的流程处理
            yield role.beforeLogin(inviterId);
            // 登录后流程处理
            this.afterLogin(role);
            return { code: define_1.ErrorCode.ok, role: role.toClient(), token: token, localTime: mx_tool_1.LocalDate.now(), lastSaveTime: role.get("lastSaveTime") };
        });
    }
    // 登录后流程
    static afterLogin(role) {
        // 更新玩家登录时间
        role.lastLoginTime = mx_tool_1.LocalDate.now();
        // 新号标记
        let isNew = role.isNew;
        if (isNew) {
            role.isNew = false;
        }
    }
    // 移除缓存(供广播其他服务使用)
    static removeRole(gameId) {
        role_1.UnitRole.delRoleCache(gameId);
    }
}
exports.GameRoleService = GameRoleService;
//# sourceMappingURL=index.js.map