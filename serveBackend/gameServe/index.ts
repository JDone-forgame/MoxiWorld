import { RPCHandle } from "mx-rpc";
import { ErrorCode } from "../../defines/define";
import { GameRoleService } from "./gamerole";
import { UnitRole } from "./gamerole/role";

@RPCHandle.class('game', module)
class game {
    @RPCHandle.init()
    public init(): boolean {
        GameRoleService.init();
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
    @RPCHandle.route()
    login(gameId: string, uid: string, unionid: string, openid: string, session_key: string, version: string, platform: any) {
        return GameRoleService.login(gameId, uid, unionid, openid, session_key, version, platform)
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
    @RPCHandle.route()
    getInfo(gameId: string, token: string) {
        return GameRoleService.loadInfo(gameId, token);
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
    @RPCHandle.route()
    setInfo(gameId: string, token: string, gameInfo: string) {
        return GameRoleService.saveInfo(gameId, token, gameInfo)
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
    @RPCHandle.route()
    setSingleInfo(gameId: string, token: string, gameInfo: string) {
        return GameRoleService.saveSingleInfo(gameId, token, gameInfo);
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
    @RPCHandle.route()
    loadMails(gameId: string, token: string) {
        return GameRoleService.doReloadMails(gameId, token);
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
    @RPCHandle.route()
    giveMail(gameId: string, token: string, sendId: string, message: string) {
        return GameRoleService.doGiveMail(gameId, token, sendId, message);
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
    @RPCHandle.route()
    optMail(gameId: string, token: string, mailId: string, type: string, state: number) {
        return GameRoleService.doOptMail(gameId, token, mailId, type, state);
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
    @RPCHandle.route()
    async addWeeklyScore(gameId: string, token: string, score: string) {
        let { code, role } = await UnitRole.getRole(gameId, token);
        let newScore = role.addWeeklyScore(parseInt(score));

        // 这里抄送排行榜服务器
        try {
            await GameRoleService.doAction(gameId, token, "addrank", newScore.toString(), "R002");
        }
        catch (e) {

        }

        return { code: ErrorCode.ok, score: newScore }
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
    @RPCHandle.route()
    async startGame(gameId: string, token: string) {
        return GameRoleService.startGame(gameId, token)
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
    @RPCHandle.route()
    async endGame(gameId: string, token: string, score: number, singleGameLock: string) {
        return GameRoleService.endGame(gameId, token, score, singleGameLock);
    }

    /**
     * 获取角色token信息(主要用于服务器内部调用)
     * @route request getRoleToken
     * @group game - 活动管理器
     * @key gameId
     * @param {string} gameId.query.required - 玩家id
     * @returns {{code: ErrorCode, token: string}} 0 - 角色信息
     */
    @RPCHandle.route()
    getRoleToken(gameId: string, token: string) {
        return GameRoleService.getRoleToken(gameId);
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
    @RPCHandle.route()
    queryItemCount(gameId: string, token: string, itemId: string) {
        return GameRoleService.queryItemCount(gameId, token, itemId);
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
    @RPCHandle.route()
    addItem(gameId: string, itemId: string, count: number) {
        return GameRoleService.addItem(gameId, itemId, count);
    }
    
}