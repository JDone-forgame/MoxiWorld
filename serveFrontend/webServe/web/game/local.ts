import { createHash } from "crypto";
import { ConfigMgr } from "mx-tool";
import { WebRouteModule } from "mx-webserve";
import { ErrorCode } from "../../../../defines/define";
import { makeGameSing } from "../../../../lib/makeGameSing";
import { gameRPC } from "../../../../rpcs/gameRPC";

@WebRouteModule.class(module)
class game {
    /**
     * 登录回复信息(简略)
     * @type LoginType
     * @param {number} code.query - 0 表示成功
     * @param {Object} role.query - 结构体
     * @param {string} gameId.query - 用户 id
     * @param {any}    gameInfo - any 用户数据
     * @param {number} gameCount - 设置用户 api 使用的次数 0 表示新手
     * @param {any}    weeklyInfo - 用户的每周数据
     * @param {string[]}   newMails - 新邮件的 mailId 调用【阅读或者删除邮件接口】后就会移除新邮件标识
     * @param {any[]}   mailInfos - 邮件数据
     * @param {string}   token - 后续操作使用的认证
    */


    /**
    * 获得 openid 和 unionid 后的登录，确保安全，所以这里采用 wx.login + wx.getAuthInfo 二合一的模式
    * @route POST /game/local/login
    * @group local - 本地接口
    * @param {string} name.query.required - 名字
    * @returns {code:number} 0 - 返回内容 
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("name", "string", true)
   async login(param: { [key: string]: string }) {
       return new Promise(function (resolve, reject) {
           let data = {
               code: 0,
               uid: '100001',
               gameId: createHash('md5').update(param.name).digest('hex'),
               account: param.name,
               openid: '',
               session_key: '',
               version: param.activeId || '10001',
           }
       gameRPC.inst
               .login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, {})
               .then(resolve)
               .catch(reject);
       })

   }

   /**
    * 登录信息
    * 返回内容
    * @route POST /game/local/logincheck
    * @group local - 本地接口
    * @param {object} info.query.required - 拉起游戏的时候 sdk 给的验证信息 
    * @returns {code:number} 0 - 返回内容 
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("info", "object", true)
   logincheck(param: { [key: string]: any }) {

       if (typeof param.info != 'object') {
           try {
               param.info = JSON.parse(param.info);
           }
           catch (e) {
               return Promise.reject({ code: ErrorCode.param_error, errMsg: `param info is wrong` });
           }
       }

       let info = param.info as {
           appId: string,
           userId: string,
           activeId: string,
           time: string,
           pltId: string,
           unionId: string,
           openId: string,
           session_key: string,
           platform: string,
           sign: string
       };

       if (ConfigMgr.get("debug.untoken") != true && makeGameSing(info) != info.sign) {
           return Promise.reject({ code: ErrorCode.login_error, errMsg: "sign is wrong" })
       }


       return new Promise(function (resolve, reject) {
           let data = {
               code: 0,
               uid: info.pltId,
               gameId: info.userId,
               account: info.unionId,
               openid: info.openId,
               session_key: info.session_key,
               version: info.activeId,
               platform: JSON.parse(info.platform || '{}')
           }
   
           gameRPC.inst
               .login(data.gameId, data.uid, data.account, data.openid, data.session_key, data.version, data.platform)
               .then(resolve)
               .catch(reject);
       })
   }

   /**
    * 获取用户信息
    * @route POST /game/local/getinfo
    * @group local - 本地接口
    * @param {string} gameId.query.required - id
    * @param {string} token.query.required - token
    * @returns {code:number} 0 - 返回内容 
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   getinfo(param: { [key: string]: string }) {
       return gameRPC.inst.getInfo(param.gameId, param.token)
   };

   /**
    * 设置用户信息
    * @route POST /game/local/setinfo
    * @group local - 本地接口
    * @param {string} gameId.query.required - id
    * @param {string} token.query.required - token
    * @param {object} gameInfo.query.required - 设置信息
    * @returns {code:number} 0 - 返回内容 
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("gameInfo", "object", true)
   setinfo(param: { [key: string]: string }) {
       return gameRPC.inst.setInfo(param.gameId, param.token, param.gameInfo)
   };

   /**
   * 设置用户信息增量
   * @route POST /game/local/setsingleinfo
   * @group local - 本地接口
   * @param {string} gameId.query.required - 名字
   * @param {string} token.query.required - token
   * @param {object} gameInfo.query.required - 设置信息
   * @returns {code:number} 0 - 返回内容 
   */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("gameInfo", "object", true)
   setsingleinfo(param: { [key: string]: string }) {
       return gameRPC.inst.setSingleInfo(param.gameId, param.token, param.gameInfo)
   };

   /**
   * 加载邮件
   * @route POST /game/local/loadmail
   * @group local - 本地接口
   * @param {string} gameId.query.required - id
   * @param {string} token.query.required - token
   * @param {object} gameInfo.query.required - 设置信息
   * @returns {code:number} 0 - 返回内容 
   */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   loadmail(param: { [key: string]: any }) {
       return gameRPC.inst.loadMails(param.gameId, param.token);
   }

   /**
    * 发送邮件
    * @route POST /game/local/givemail
    * @group local - 本地接口
    * @param {string} gameId.query.required - id
    * @param {string} token.query.required - token
    * @param {string} sendId.query.required - 接收者id
    * @param {string} message.query.required - 消息内容
    * @returns {code:number} 0 - 返回内容 
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("sendId", "string", true)
   @WebRouteModule.paramRequired("message", "string", true)
   givemail(param: { [key: string]: string }) {
       return gameRPC.inst.giveMail(param.gameId, param.token, param.sendId, param.message);
   };


   /**
   * 操作邮件
   * @route POST /game/local/optmail
   * @group local - 本地接口
   * @param {string} gameId.query.required - id
   * @param {string} token.query.required - token
   * @param {string} mailId.query.required - 邮件id
   * @param {string} type.query.required - 操作类型 -egs:delete,state
   * @param {number} state.query.required - 状态码 type是state时生效
   * @returns {code:number} 0 - 返回内容 
   */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("mailId", "string", true)
   @WebRouteModule.paramRequired("type", "string", true)
   @WebRouteModule.paramRequired("state", "number", true)
   optmail(param: { [key: string]: any }) {
       return gameRPC.inst.optMail(param.gameId, param.token, param.mailId, param.type, parseInt(param.state));
   };

   /**
    * 增加每周积分
    * @route POST /game/local/addweeklyscore
    * @group local - 本地接口
    * @param {string} gameId.query.required - id
    * @param {string} token.query.required - token
    * @param {number} score.query.required - 积分
    * @returns {code:number} 0 - 返回内容 
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("score", "number", true)
   async addweeklyscore(param: { [key: string]: any }) {
       return gameRPC.inst.addWeeklyScore(param.gameId, param.token, param.score);
   }

   /**
    * 开始游戏
    * @date 2020-09-24
    * @route POST /game/local/startgame
    * @group game - 活动管理器
    * @param {string} gameId.query.required - 玩家id
    * @param {string} token.query.required - token
    * @returns {code:number} 0 - 操作结果
    * @returns {singleGameLock:string} string - 返回的密钥
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   startgame(param: { [key: string]: any }) {
       return gameRPC.inst.startGame(param.gameId, param.token)
   }

   /**
    * 结算游戏
    * @date 2020-09-24
    * @route POST /game/local/endgame
    * @group game - 活动管理器
    * @param {string} gameId.query.required - 玩家id
    * @param {string} token.query.required - token
    * @param {number} score.query.required - score
    * @param {string} singleGameLock.query.required - 单局密钥
    * @param {number} addScore - 添加分数（可不传）
    * @param {number} level - level（可不传）
    * @returns {code:number} 0 - 操作结果
    * @returns {highestScore:number} number - 历史最高分数
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("score", "number", true)
   @WebRouteModule.paramRequired("singleGameLock", "string", true)
   endgame(param: { [key: string]: any }) {
       return gameRPC.inst.endGame(param.gameId, param.token, param.score, param.singleGameLock);
   }

   /**
    * 查询道具数量
    * @date 2020-09-29
    * @route POST /game/local/queryItemCount
    * @group game - 活动管理器
    * @param {string} gameId.query.required - 玩家id
    * @param {string} token.query.required - token
    * @param {string} itemId.query.required - itemId
    * @returns { code: number} 0 - 操作结果
    */
   @WebRouteModule.route()
   @WebRouteModule.paramRequired("gameId", "string", true)
   @WebRouteModule.paramRequired("token", "string", true)
   @WebRouteModule.paramRequired("itemId", "string", true)
   queryitemcount(param: { [key: string]: any }) {
       return gameRPC.inst.queryItemCount(param.gameId, param.token, param.itemId);
   }

}