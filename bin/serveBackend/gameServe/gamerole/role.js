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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRole = void 0;
const mx_database_1 = require("mx-database");
const mx_tool_1 = require("mx-tool");
const logger_1 = require("../../../lib/logger");
const node_cache_1 = __importDefault(require("node-cache"));
const gameRPC_1 = require("../../../rpcs/gameRPC");
const define_1 = require("../../../defines/define");
class UnitRole {
    // 初始化
    static init() {
        return Promise.resolve();
    }
    // token验证
    get token() {
        return this.dbInfo.get('token');
    }
    // session
    get session_key() {
        return this.dbInfo.get('session_key') || '';
    }
    set session_key(sessionKey) {
        this.dbInfo.set('session_key', sessionKey);
    }
    get version() {
        return this.dbInfo.get('version') || "";
    }
    get uid() {
        return this.dbInfo.get('uid');
    }
    get nickName() {
        return this.dbInfo.get('nickName') || "";
    }
    set nickName(v) {
        this.dbInfo.set('nickName', v || "");
    }
    get avatarUrl() {
        return this.dbInfo.get('avatarUrl') || "";
    }
    set avatarUrl(v) {
        this.dbInfo.set('avatarUrl', v);
    }
    get activityStartTime() {
        return this.dbInfo.get("activityStartTime") || 0;
    }
    set activityStartTime(v) {
        this.dbInfo.set("activityStartTime", v);
    }
    get activityEndTime() {
        return this.dbInfo.get("activityEndTime") || 0;
    }
    set activityEndTime(v) {
        this.dbInfo.set("activityEndTime", v);
    }
    get activityId() {
        return this.dbInfo.get("activityId") || "";
    }
    set activityId(v) {
        this.dbInfo.set("activityId", v);
    }
    // 是否新人
    get isNew() {
        return this.dbInfo.get('isNew');
    }
    set isNew(v) {
        this.dbInfo.set('isNew', v);
    }
    get lastLoginTime() {
        return this.dbInfo.get('lastLoginTime');
    }
    set lastLoginTime(v) {
        this.dbInfo.set('lastLoginTime', v);
    }
    get unionid() {
        return this.dbInfo.get('unionid') || '';
    }
    /**------------------------------------------------------通用部分------------------------------------------------------------- */
    // 发给客户端的数据
    toClient() {
        let loginInfo = {
            gameId: this.dbInfo.get('_id'),
            nickName: this.nickName,
            isNew: this.isNew,
            activityStartTime: this.activityStartTime,
            activityEndTime: this.activityEndTime,
            activityId: this.activityId
        };
        return loginInfo;
    }
    // 保存role缓存
    static setRoleCache(gameId, role) {
        this.roleCache.set(gameId, role);
    }
    // 获取role缓存
    static getRoleCache(gameId) {
        let cache = this.roleCache.get(gameId);
        if (!cache) {
            return null;
        }
        // 重设ttl
        this.roleCache.ttl(gameId, this.stdTTL);
        return cache;
    }
    // 删除role缓存
    static delRoleCache(gameId) {
        let t_info = UnitRole.getRoleCache(gameId);
        if (!t_info)
            return false;
        this.roleCache.del(gameId);
        return true;
    }
    // 数据库存写方法
    get(key) {
        return this.dbInfo.get(key);
    }
    set(key, value) {
        this.dbInfo.set(key, value);
    }
    // 获取玩家
    static getRole(gameId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleCache = yield UnitRole.getRoleCache(gameId);
            if (roleCache) {
                if (token == undefined || roleCache.token == token) {
                    return Promise.resolve({ code: define_1.ErrorCode.ok, role: roleCache });
                }
                else {
                    throw ({ code: define_1.ErrorCode.role_token_error });
                }
            }
            // 重新下载玩家
            return new Promise(function (resolve, reject) {
                mx_database_1.MongodbMoudle.get_database(define_1.DBDefine.db).get_unit(define_1.DBDefine.col_role, { _id: gameId }).load().then(function (dbInfo) {
                    if (dbInfo.empty) {
                        // 这里需要创角
                        reject({ code: define_1.ErrorCode.role_no });
                    }
                    else {
                        // 这里ok了
                        UnitRole.createLoad(gameId, dbInfo).then(role => {
                            if (token == undefined || role.token == token) {
                                resolve({ code: define_1.ErrorCode.ok, role: UnitRole.getRoleCache(gameId) });
                            }
                            else {
                                reject({ code: define_1.ErrorCode.role_token_error });
                            }
                        }).catch(function (errMsg) {
                            reject({ code: define_1.ErrorCode.role_token_error, errMsg: errMsg });
                        });
                    }
                }).catch(function (res) {
                    // 异常了，这里需要退出
                    // console.log(res);
                    reject({ code: define_1.ErrorCode.db_error, errMsg: res });
                });
            });
        });
    }
    // 创建一个对象
    static createLoad(gameId, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleCache = yield UnitRole.getRoleCache(gameId);
            if (roleCache) {
                return roleCache;
            }
            // 保存数据
            let role;
            try {
                role = new UnitRole();
                role.dbInfo = db;
                role.gameId = gameId;
            }
            catch (e) {
                throw { errMsg: e ? e : 'some default data is error!' };
            }
            // 读取邮件
            UnitRole.setRoleCache(gameId, role);
            // 通知一下其他人
            gameRPC_1.gameRPC.inst.bcRemoveRole(gameId);
            return role;
        });
    }
    // 注册流程
    static registRole(gameId, uid, unionid, openid, session_key, version, inviterId, nickName, avatarUrl, activityId, activityStartTime, activityEndTime) {
        let roleCache = UnitRole.getRoleCache(gameId);
        if (roleCache) {
            return Promise.reject({ code: define_1.ErrorCode.role_exist });
        }
        return new Promise(function (resolve, reject) {
            mx_database_1.MongodbMoudle.get_database(define_1.DBDefine.db)
                .update_insert(define_1.DBDefine.col_role, { _id: gameId }, { uid: uid, unionId: unionid, openId: openid, version: version, session_key: session_key, lastSaveTime: mx_tool_1.LocalDate.now(), beneficiaryId: inviterId, nickName: nickName, avatarUrl: avatarUrl, activityId: activityId, activityStartTime: activityStartTime, activityEndTime: activityEndTime })
                .then(function () {
                UnitRole.getRole(gameId).then((rs) => {
                    // 初始化角色数据
                    UnitRole.initRoleData(gameId);
                    // 保存注册日志
                    logger_1.LoggerMoudle.roleRegist(gameId, uid, activityId, inviterId);
                    resolve(rs);
                }).catch(reject);
            }).catch(reject);
        });
    }
    // 初始化角色数据
    static initRoleData(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield this.getRoleCache(gameId);
            if (role) {
                // 新手标记
                role.isNew = true;
            }
        });
    }
    // 登录前事务处理
    beforeLogin(inviterId) {
        return __awaiter(this, void 0, void 0, function* () {
            // 保存登录日志
            logger_1.LoggerMoudle.roleLogin(this.gameId, this.uid, this.activityId, inviterId);
        });
    }
}
exports.UnitRole = UnitRole;
// role缓存数据：必须通过封装函数操作缓存数据
UnitRole.stdTTL = 3 * 60 * 60;
UnitRole.roleCache = new node_cache_1.default({ stdTTL: UnitRole.stdTTL, checkperiod: 120, useClones: false });
//# sourceMappingURL=role.js.map