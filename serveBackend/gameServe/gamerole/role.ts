import { createHash } from "crypto";
import { CacheMoudle, MongodbMoudle, ReHash } from "mx-database";
import { LocalDate } from "mx-tool";
import { DBDefine, ErrorCode, ifItemInfo } from "../../../defines/define";
import { LoggerInstance } from "../../../lib/logger";

export class UnitRole {
    // 初始化
    static init() {
        return Promise.resolve();
    }

    // 游戏id这个和 _id绑定
    gameId!: string;

    dbInfo!: ReHash<{ [key: string]: (string | number | object) }>;
    mailInfos!: ifMailInfo[];
    newMailIds: string[] = [];

    // 微信认证后的信息
    authState: 'authed' | 'timeout' = 'authed';

    // 现在并没有读表操作，所以暂定游戏次数的itemId
    static GAME_CHANCE_ID: string = 'k1';

    // 最后一次活跃时间
    lastAction: number = LocalDate.now();

    // 微信认证后的信息
    authInfo: { [key: string]: any } = {};

    // unionId的缓存池子
    private static gameIdMap: CacheMoudle<UnitRole> = CacheMoudle.createCache("roleUnit", 10 * 60 * 1000);


    get openId(): string {
        return this.dbInfo.get('openId') || '';
    };

    get unionId(): string {
        return this.dbInfo.get('unionId') || '';
    }

    // 玩家id 一个玩家id可能对应多个gameId
    get uid(): string {
        return this.dbInfo.get('uid');
    }

    // session_key
    get session_key(): string {
        return this.dbInfo.get('session_key') || '';
    }

    get token(): string {
        return this.dbInfo.get('token');
    }

    get version() {
        return this.dbInfo.get('version') || ""
    }

    // 游戏信息
    get gameInfo() {
        return this.dbInfo.get('gameInfo') || {};
    }

    // 平台道具
    get platformItems(): { [itemid: string]: number } {
        return this.dbInfo.get('platformItems') || {};
    }

    // 数据库get方法
    get(key: string) {
        return this.dbInfo.get(key);
    }

    // 数据库set方法
    set(key: string, value: any) {
        this.dbInfo.set(key, value);
    }    

    // 数据立即保存，否则的话是1s之后触发保存
    flush() {
        return this.dbInfo.force_save();
    }

    // 获取玩家位置
    getLocation() {
        let platform = this.dbInfo.get('platform')
        if (!platform) return undefined;
        return platform.location;
    }

    // 生成登录后发送给客户端的数据
    toClinet() {
        return {
            gameId: this.dbInfo.get('_id'),
            gameChance: this.getItemCount(UnitRole.GAME_CHANCE_ID),
            gameInfo: this.dbInfo.get('gameInfo') || {},
            weeklyInfo: this.getWeeklyInfo(),
            gameCount: this.get('gameCount') || 0, // 设置用户 api 使用的次数 0 表示新手
            newMails: this.newMailIds,
            mailInfos: this.mailInfos,
            location: this.getLocation()
        }
    }   
    
    // 加载邮件
    async loadMail() {
        const v = await MongodbMoudle.get_database(DBDefine.db).get_list<ifMailInfo>(DBDefine.col_mail, { ownerId: this.gameId }).load();
        this.newMailIds = [];
        this.mailInfos = v.value;
        for (let i = 0; i < this.mailInfos.length; i++) {
            let rMail = this.mailInfos[i];
            if (rMail.state == 0) {
                this.newMailIds.push(rMail.mailId);
            }
        }
    }   
    
    // 创建一个对象
    private static async createLoad(gameId: string, db: ReHash<{ [key: string]: (string | number | object) }>) {
        if (UnitRole.gameIdMap.hasOwnProperty(gameId)) return UnitRole.gameIdMap.get(gameId) as UnitRole;
        let role = new UnitRole();
        role.dbInfo = db;
        role.gameId = gameId;
        role.lastAction = LocalDate.now();
        await role.loadMail()
        UnitRole.gameIdMap.set(gameId, role);
        // 通知一下其他人
        // MasterSlaverMoudle.slaver.broadNotice(MCNotice.loadCache, { roleId: gameId });
        return role;
    }

    // 创建角色流程
    static registRole(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string): Promise<{ code: number, role: UnitRole }> {
        if (this.gameIdMap.hasOwnProperty(gameId)) return Promise.reject({ code: ErrorCode.role_exist });

        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db)
                .update_insert(DBDefine.col_role, { _id: gameId }, { uid: uid, unionId: unionid, openId: openid, version: version, session_key: session_key, lastSaveTime: LocalDate.now() })
                .then(function () {
                    UnitRole.getRole(gameId).then(resolve).catch(reject);
                }).catch(reject)
        })
    }

    // 查询用户信息，这里的用户信息是直接去数据库读取的，不做本地缓存策略，或者说和正常游戏玩家策略分离
    static queryRole(gameId: string): Promise<{ gameInfo: { [key: string]: (string | number | object) }, version: string }> {
        let cacheUnit:UnitRole = this.gameIdMap.get(gameId)
        if (cacheUnit) {
            return Promise.resolve({ gameInfo: cacheUnit.gameInfo, version: cacheUnit.get("version") });
        }
        else {
            // 重新下载玩家
            return new Promise(function (resolve, reject) {
                MongodbMoudle.get_database(DBDefine.db)
                    .get_unit<{ [key: string]: any }>(DBDefine.col_role, { _id: gameId })
                    .load()
                    .then(function (dbInfo) {
                        if (dbInfo.empty) {
                            // 这里需要创角
                            reject({ code: ErrorCode.role_no, errMsg: "no role in game" });
                        }
                        else {
                            // 这里ok了
                            resolve({ gameInfo: dbInfo.get("gameInfo") || {}, version: dbInfo.get("version") });
                        }
                    }).catch(function (res) {
                        // 异常了，这里需要推出
                        // console.log(res);
                        reject({ code: ErrorCode.db_error, errMsg: res });
                    })
            })
        }
    }

    // 为了后期分布式服务，这里采用回调模式
    static getRole(gameId: string, token?: string): Promise<{ code: number, role: UnitRole }> {
        if (this.gameIdMap.hasOwnProperty(gameId)) {
            if (token == undefined || (this.gameIdMap.get(gameId) as UnitRole).token == token) {
                return Promise.resolve({ code: ErrorCode.ok, role: this.gameIdMap.get(gameId) as UnitRole });
            }
            else {
                return Promise.reject({ code: ErrorCode.role_token_error });
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
                            resolve({ code: ErrorCode.ok, role: UnitRole.get(gameId) });
                        }
                        else {
                            reject({ code: ErrorCode.role_token_error });
                        }
                    }).catch(function () {
                        reject({ code: ErrorCode.role_token_error });
                    });

                }
            }).catch(function (res) {
                // 异常了，这里需要推出
                // console.log(res);
                reject({ code: ErrorCode.db_error, errMsg: res });
            })
        })
    }

    // 添加邮件接口，主要提供给大家处理邮件的，支持给别人发送邮件
    static giveMail(fromId: string, senderId: string, message: any) {
        // 这里生成一个唯一的mailId
        let mailInfo: ifMailInfo = {
            mailId: createHash("md5").update(senderId + fromId + LocalDate.now() + Math.random()).digest("hex"),
            ownerId: senderId,
            senderId: fromId,
            message: message,
            time: LocalDate.now(),
            state: 0
        }

        let role:UnitRole = this.gameIdMap.get(senderId);
        // 这里检查一下是否有这个玩家存在
        if (role) {
            // 如果存在就丢一份进去
            role.mailInfos.push(mailInfo);
            role.newMailIds.push(mailInfo.mailId);
        }

        //严格的话需要通知下某个节点，处理一下用户信息

        // 数据库里面也要丢一份进去
        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db).insert(DBDefine.col_mail, mailInfo).then(function () {
                resolve({ code: ErrorCode.ok })
            }).catch(e => {
                reject({ code: ErrorCode.db_error, errMsg: e });
            })
        })
    }

    // 删除邮件
    static delDBMail(gameId: string, mailId: string) {
        let role:UnitRole = this.gameIdMap.get(gameId);
        if (role) {
            let find = false;
            for (let i = 0; i < role.mailInfos.length; i++) {
                let mailInfo = role.mailInfos[i];
                if (mailInfo && mailInfo.mailId == mailId) {
                    // 找到了邮件
                    role.mailInfos.splice(i, 1);
                    find = true;
                    break;
                }
            }
            let idx = role.newMailIds.indexOf(mailId);
            if (idx) {
                role.newMailIds.splice(idx, 1);
            }
            if (!find) return Promise.reject({ code: ErrorCode.role_no_mail, errMsg: 'no mailId:' + mailId });
        }

        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db).del(DBDefine.col_mail, { mailId: mailId }).then(function () {
                resolve({ code: ErrorCode.ok })
            }).catch(e => {
                reject({ code: ErrorCode.db_error, errMsg: e });
            })
        })
    }

    // 修改邮件内容
    static updateDBMail(gameId: string, mailId: string, state: number) {
        let role:UnitRole = this.gameIdMap.get(gameId);
        if (role) {
            let find = false;
            for (let i = 0; i < role.mailInfos.length; i++) {
                let mailInfo = role.mailInfos[i];
                if (mailInfo && mailInfo.mailId == mailId) {
                    // 找到了邮件
                    mailInfo.state = state;
                    find = true;
                    break;
                }
            }
            let idx = role.newMailIds.indexOf(mailId);
            if (idx) {
                role.newMailIds.splice(idx, 1);
            }

            if (!find) return Promise.reject({ code: ErrorCode.role_no_mail, errMsg: 'no mailId:' + mailId });
        }

        return new Promise(function (resolve, reject) {
            MongodbMoudle.get_database(DBDefine.db).get_unit(DBDefine.col_mail, { mailId: mailId }).load().then(function (mail) {
                if (mail.empty) {
                    return reject({ code: ErrorCode.role_no_mail, errMsg: 'no mailId:' + mailId });
                }
                mail.set('state', state);
                mail.force_save().then(function () {
                    resolve({ code: ErrorCode.ok })
                }).catch(e => {
                    reject({ code: ErrorCode.db_error, errMsg: e });
                })
            }).catch(e => {
                reject({ code: ErrorCode.db_error, errMsg: e });
            })
        })
    }

    // 从缓存池中获取用户
    private static get(gameId: string): UnitRole {
        return this.gameIdMap.get(gameId) as UnitRole;
    }

    // 缓存池删除指定用户
    static del(gameId: string): boolean {

        let t_info:UnitRole = this.gameIdMap.get(gameId);
        if (!t_info) return false;

        this.gameIdMap.del(t_info.gameId);
        return true;
    }

    // 删掉用户
    static async boomRole(gameId: string) {
        this.gameIdMap.del(gameId);
        // 删掉角色
        await MongodbMoudle.get_database(DBDefine.db).del(DBDefine.col_role, { _id: gameId })
        // 删掉邮件
        await MongodbMoudle.get_database(DBDefine.db).del(DBDefine.col_mail, { ownerId: gameId })

        return true;
    }

    // 获取每周数据
    getWeeklyInfo() {
        function newWeeklyInfo(week: any = {}) {
            week.time = LocalDate.now();
            week.score = 0;
            week.award = false;
            return week
        }

        let weekInfo = this.get("weeklyInfo") as ifWeeklyInfo;
        if (!weekInfo) {
            weekInfo = newWeeklyInfo()
            this.setWeeklyInfo(weekInfo)
        }

        if (!isWeekly(weekInfo.time, LocalDate.now())) {
            newWeeklyInfo(weekInfo);
            this.setWeeklyInfo(weekInfo)
        }

        return weekInfo;
    }

    // 保存每周数据
    setWeeklyInfo(wk: ifWeeklyInfo) {
        this.set("weeklyInfo", wk)
    }

    // 添加周赛积分
    addWeeklyScore(score: number) {
        if (isNaN(score)) {
            score = 0;
        }
        let wk = this.getWeeklyInfo();
        wk.score = wk.score + score;

        LoggerInstance.weeklyScoreLog(this.gameId, this.uid, wk.score, score, this.version)

        this.setWeeklyInfo(wk)

        return wk.score;
    }

    // 查询奖励情况
    getWeeklyAward() {
        let weekInfo = this.getWeeklyInfo();
        return weekInfo.award;
    }

    // 设置每周奖励 返回设置是否成功
    setWeeklyAward() {
        let wk = this.getWeeklyInfo();
        if (wk.award) {
            return false;
        }
        wk.award = true;
        this.setWeeklyInfo(wk)

        return true;
    }

    //判断是否可以进行游戏，如果可以返回真，次数减一
    canPlay(): boolean {
        if (this.getItemCount(UnitRole.GAME_CHANCE_ID) > 0) {
            this.updateGameChance(this.getItemCount(UnitRole.GAME_CHANCE_ID) - 1)
            return true;
        }
        return false;
    }
    
    // 添加道具
    static async addItem(gameId: string, itemid: string, count: number) {
        let roleResult = await UnitRole.getRole(gameId);
        if (!roleResult) {
            return Promise.reject({ code: ErrorCode.role_no, errMsg: "role is not found!" });
        }
        let role = roleResult.role;

        // 添加物品
        role.updateItemCount(itemid, role.getItemCount(itemid) + count);

        await role.dbInfo.force_save();

        return {
            code: ErrorCode.ok
            , gameChance: role.getItemCount('k1')
        };
    }

    // 更新道具信息
    updateItemCount(itemId: string, newCount: number) {
        //let itemRes = TableMgr.inst.getItemInfo(itemId)
        //if (!itemRes) return { code: ErrorCode.ok };

        // 刷新下体力值
        if (itemId == UnitRole.GAME_CHANCE_ID) {
            this.updateGameChance(newCount || 0);
        }

        let items = this.dbInfo.get('playerItems') || {};
        items[itemId] = newCount;
        this.dbInfo.set('playerItems', items);
    }

    // 获取道具数量
    getItemCount(itemId: string): number {
        let items = this.dbInfo.get('playerItems') || {};

        // 刷新下体力值
        if (itemId == UnitRole.GAME_CHANCE_ID) {
            this.updateGameChance(items[itemId] || 0);
        }

        let newItems = this.dbInfo.get('playerItems') || {};
        return newItems[itemId] || 0;
    }

    // 更新游戏次数
    private updateGameChance(gameChance: number) {
        //由平台做体力自增，这里不需要考虑
        //后续方便游戏次数规则改动

        // 更新游戏次数
        let items = this.dbInfo.get('playerItems') || {};
        items[UnitRole.GAME_CHANCE_ID] = gameChance;
        this.dbInfo.set('playerItems', items);

    }

    // 将指定格式字符串转换成物品列表
    // param itemListString 格式：物品id1:数量1|物品id2:数量2|....
    convertItemStringToList(itemListString: string): Array<ifItemInfo> {
        let itemList: Array<ifItemInfo> = [];
        if (!itemListString || itemListString === "") {
            return itemList;
        }    

        let stringList: Array<string> = itemListString.split("|");
        if (stringList && stringList.length > 0) {
            for (let i = 0; i < stringList.length; ++i) {
                let itemString = stringList[i];
                let itemPair: Array<string> = itemString.split(",");
                if (!itemPair || itemPair.length !== 2) {
                    continue;
                }

                let itemInfo: ifItemInfo = {
                    itemId: itemPair[0],
                    count: parseInt(itemPair[1])
                }
    
                // 物品数量必须大于0
                if (itemInfo.count <= 0) {
                    continue;
                }
    
                itemList.push(itemInfo);
            }        
        }

        return itemList;
    }

    // 检查背包中是否有足够的物品
    OwnItems(items: Array<ifItemInfo>): boolean {
        if (!items || items.length <= 0) {
            return true;
        }

        for (let i = 0; i < items.length; ++i) {
            let itemInfo = items[i];
            let ownItemCount = this.getItemCount(itemInfo.itemId);
            if (itemInfo.count > ownItemCount) {
                return false;
            }
        }

        return true;
    }

    // 消耗指定的物品
    UseItems(items: Array<ifItemInfo>): boolean {
        if (!items || items.length <= 0) {
            return true;
        }

        // 先判断是否有足够的物品
        if (!this.OwnItems(items)) {
            return false;
        }

        // 使用物品
        for (let i = 0; i < items.length; ++i) {
            let itemInfo = items[i];
            let ownItemCount = this.getItemCount(itemInfo.itemId);
            if (itemInfo.count <= ownItemCount) {
                this.updateItemCount(itemInfo.itemId, ownItemCount - itemInfo.count);
            }
        }

        return true;
    }

}

MongodbMoudle.regist_colltion(DBDefine.db, DBDefine.col_role, ["uid_1", "openId_1"]);
MongodbMoudle.regist_colltion(DBDefine.db, DBDefine.col_mail, ["mailId_1", "ownerId_1"]);

// 判断是否时同一周
function isWeekly(timeA: string | number, timeB: string | number) {
    let tA = new Date(timeA);
    tA.setHours(0, 0, 0, 0);
    let tB = new Date(timeB);
    tB.setHours(0, 0, 0, 0);

    let w1 = tA.getDay();
    if (w1 == 0) w1 = 7;
    let t1 = tA.getTime() - w1 * (1000 * 60 * 60 * 24);
    let w2 = tB.getDay();
    if (w2 == 0) w2 = 7;
    let t2 = tB.getTime() - w2 * (1000 * 60 * 60 * 24);

    if (t1 != t2) {
        return false
    }

    return true;

}

//是否是同一天
function isSameDay(timeStampA: number, timeStampB: number): boolean {
    let dateA = new Date(timeStampA);
    let dateB = new Date(timeStampB);
    return (dateA.setHours(0, 0, 0, 0) == dateB.setHours(0, 0, 0, 0));
}

// 邮件接口
interface ifMailInfo {
    // 邮件的id唯一
    mailId: string,
    // 收件人
    ownerId: string,
    // 发件人
    senderId: string,
    // 内容
    message: any,
    // 发件时间
    time: number,
    // 邮件状态
    state: number
}

// 周赛信息接口
interface ifWeeklyInfo {
    time: number,
    score: number,
    award: boolean
}