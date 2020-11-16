import { MongodbMoudle, ReHash } from "mx-database";
import { LocalDate } from "mx-tool";
import { LoggerMoudle } from "../../../lib/logger";
import { TableMgr } from "../../../lib/TableMgr";
import NodeCache from "node-cache"
import { gameRPC } from "../../../rpcs/gameRPC";
import { DBDefine, ErrorCode } from "../../../defines/define";

export class UnitRole {
    // 初始化
    static init() {
        return Promise.resolve();
    }

    /**------------------------------------------------------默认变量------------------------------------------------------------- */

    gameId!: string;
    dbInfo!: ReHash<{ [key: string]: (string | number | object) }>;


    // role缓存数据：必须通过封装函数操作缓存数据
    static readonly stdTTL = 3 * 60 * 60;
    static roleCache = new NodeCache({ stdTTL: UnitRole.stdTTL, checkperiod: 120, useClones: false });


    // token验证
    get token(): string {
        return this.dbInfo.get('token');
    }
    // session
    get session_key(): string {
        return this.dbInfo.get('session_key') || '';
    }

    set session_key(sessionKey: string) {
        this.dbInfo.set('session_key', sessionKey);
    }

    get version() {
        return this.dbInfo.get('version') || "";
    }

    get uid(): string {
        return this.dbInfo.get('uid');
    }

    get nickName(): string {
        return this.dbInfo.get('nickName') || "";
    }

    set nickName(v: string) {
        this.dbInfo.set('nickName', v || "");
    }

    get avatarUrl(): string {
        return this.dbInfo.get('avatarUrl') || "";
    }

    set avatarUrl(v: string) {
        this.dbInfo.set('avatarUrl', v);
    }

    get activityStartTime(): number {
        return this.dbInfo.get("activityStartTime") || 0;
    }

    set activityStartTime(v: number) {
        this.dbInfo.set("activityStartTime", v);
    }

    get activityEndTime(): number {
        return this.dbInfo.get("activityEndTime") || 0;
    }

    set activityEndTime(v: number) {
        this.dbInfo.set("activityEndTime", v);
    }

    get activityId(): string {
        return this.dbInfo.get("activityId") || "";
    }

    set activityId(v: string) {
        this.dbInfo.set("activityId", v);
    }

    // 是否新人
    get isNew(): boolean {
        return this.dbInfo.get('isNew');
    }

    set isNew(v: boolean) {
        this.dbInfo.set('isNew', v);
    }

    get lastLoginTime(): number {
        return this.dbInfo.get('lastLoginTime');
    }

    set lastLoginTime(v: number) {
        this.dbInfo.set('lastLoginTime', v);
    }

    get unionid(): string {
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
        }

        return loginInfo;
    }

    // 保存role缓存
    private static setRoleCache(gameId: string, role: UnitRole) {
        this.roleCache.set<UnitRole>(gameId, role);
    }

    // 获取role缓存
    private static getRoleCache(gameId: string): UnitRole {
        let cache = this.roleCache.get<UnitRole>(gameId);
        if (!cache) {
            return null;
        }
        // 重设ttl
        this.roleCache.ttl(gameId, this.stdTTL);
        return cache;
    }

    // 删除role缓存
    static delRoleCache(gameId: string) {
        let t_info = UnitRole.getRoleCache(gameId);
        if (!t_info) return false;

        this.roleCache.del(gameId);
        return true;
    }

    // 数据库存写方法
    get(key: string) {
        return this.dbInfo.get(key)
    }
    set(key: string, value: any) {
        this.dbInfo.set(key, value)
    }

    // 获取玩家
    static async getRole(gameId: string, token?: string): Promise<{ code: ErrorCode, role: UnitRole }> {
        let roleCache = await UnitRole.getRoleCache(gameId);
        if (roleCache) {
            if (token == undefined || roleCache.token == token) {
                return Promise.resolve({ code: ErrorCode.ok, role: roleCache });
            }
            else {
                throw ({ code: ErrorCode.role_token_error });
            }
        }

        // 重新下载玩家
        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db).get_unit<{ [key: string]: any }>(DBDefine.col_role, { _id: gameId }).load().then(function (dbInfo) {
                if (dbInfo.empty) {
                    // 这里需要创角
                    reject({ code: ErrorCode.role_no });
                }
                else {
                    // 这里ok了
                    UnitRole.createLoad(gameId, dbInfo).then(role => {
                        if (token == undefined || role.token == token) {
                            resolve({ code: ErrorCode.ok, role: UnitRole.getRoleCache(gameId) });
                        }
                        else {
                            reject({ code: ErrorCode.role_token_error });
                        }
                    }).catch(function (errMsg) {
                        reject({ code: ErrorCode.role_token_error, errMsg: errMsg });
                    });

                }
            }).catch(function (res) {
                // 异常了，这里需要退出
                // console.log(res);
                reject({ code: ErrorCode.db_error, errMsg: res });
            })
        })
    }

    // 创建一个对象
    private static async createLoad(gameId: string, db: ReHash<{ [key: string]: (string | number | object) }>) {
        let roleCache = await UnitRole.getRoleCache(gameId);
        if (roleCache) {
            return roleCache;
        }

        // 保存数据
        let role;
        try {
            role = new UnitRole();
            role.dbInfo = db;
            role.gameId = gameId;
        } catch (e) {
            throw { errMsg: e ? e : 'some default data is error!' }
        }

        // 读取邮件

        UnitRole.setRoleCache(gameId, role);
        // 通知一下其他人
        gameRPC.inst.bcRemoveRole(gameId);
        return role;
    }

    // 注册流程
    static registRole(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string, inviterId: string, nickName: string, avatarUrl: string, activityId: string, activityStartTime: number, activityEndTime: number): Promise<{ code: number, role: UnitRole }> {
        let roleCache = UnitRole.getRoleCache(gameId);
        if (roleCache) {
            return Promise.reject({ code: ErrorCode.role_exist });
        }
        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db)
                .update_insert(DBDefine.col_role, { _id: gameId }, { uid: uid, unionId: unionid, openId: openid, version: version, session_key: session_key, lastSaveTime: LocalDate.now(), beneficiaryId: inviterId, nickName: nickName, avatarUrl: avatarUrl, activityId: activityId, activityStartTime: activityStartTime, activityEndTime: activityEndTime })
                .then(function () {
                    UnitRole.getRole(gameId).then((rs) => {

                        // 初始化角色数据
                        UnitRole.initRoleData(gameId);

                        // 保存注册日志
                        LoggerMoudle.roleRegist(gameId, uid, activityId, inviterId);

                        resolve(rs);
                    }).catch(reject);
                }).catch(reject)
        })
    }

    // 初始化角色数据
    static async initRoleData(gameId: string) {
        let role = await this.getRoleCache(gameId);
        if (role) {
            // 新手标记
            role.isNew = true;
        }
    }

    // 登录前事务处理
    public async beforeLogin(inviterId: string) {
        // 保存登录日志
        LoggerMoudle.roleLogin(this.gameId, this.uid, this.activityId, inviterId);
    }

    /**------------------------------------------------------游戏部分------------------------------------------------------------- */

}