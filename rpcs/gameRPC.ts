/**
 * this is a auto create file
 * 这是一个自动生成的文件,最好不要直接改动这个文件
 */

import { RequestRPC } from "./nodesocket"
import {ErrorCode} from "../defines/define"


class localgameRPC extends RequestRPC {
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
	login(gameId: string, uid: string, unionid: string, openid: string, sessionKey: string, version: string, platform: any):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			uid: uid,
			unionid: unionid,
			openid: openid,
			sessionKey: sessionKey,
			version: version,
			platform: platform
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "login", Object.assign(query, body),"gameId,uid,unionid,openid,sessionKey,version,platform".split(","),"gameId")
	}
	/**
	 * 
获取用户信息
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 */
	getInfo(gameId: string, token: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "getInfo", Object.assign(query, body),"gameId,token".split(","),"gameId")
	}
	/**
	 * 
设置用户信息
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 * @param {string} gameInfo gameInfo
	 */
	setInfo(gameId: string, token: string, gameInfo: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			gameInfo: gameInfo
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "setInfo", Object.assign(query, body),"gameId,token,gameInfo".split(","),"gameId")
	}
	/**
	 * 
设置用户信息增量设置
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 * @param {string} gameInfo gameInfo
	 */
	setSingleInfo(gameId: string, token: string, gameInfo: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			gameInfo: gameInfo
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "setSingleInfo", Object.assign(query, body),"gameId,token,gameInfo".split(","),"gameId")
	}
	/**
	 * 
加载邮件
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 */
	loadMails(gameId: string, token: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "loadMails", Object.assign(query, body),"gameId,token".split(","),"gameId")
	}
	/**
	 * 
发送邮件
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 * @param {string} sendId 收件人
	 * @param {string} message 消息
	 */
	giveMail(gameId: string, token: string, sendId: string, message: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			sendId: sendId,
			message: message
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "giveMail", Object.assign(query, body),"gameId,token,sendId,message".split(","),"gameId")
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
	optMail(gameId: string, token: string, mailId: string, type: string, state: number):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			mailId: mailId,
			type: type,
			state: state
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "optMail", Object.assign(query, body),"gameId,token,mailId,type,state".split(","),"gameId")
	}
	/**
	 * 
增加每周数据
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 * @param {string} score score
	 */
	addWeeklyScore(gameId: string, token: string, score: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			score: score
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "addWeeklyScore", Object.assign(query, body),"gameId,token,score".split(","),"gameId")
	}
	/**
	 * 
开始游戏
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 */
	startGame(gameId: string, token: string):Promise<any> {
	    let query = {
			gameId: gameId,
			token: token
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "startGame", Object.assign(query, body),"gameId,token".split(","),"gameId")
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
	endGame(gameId: string, token: string, score: number, singleGameLock: string, addScore?: number, level?: number):Promise<any> {
	    let query = {
			gameId: gameId,
			token: token,
			score: score,
			singleGameLock: singleGameLock
	    }
	
	    let body = {
			addScore: addScore,
			level: level
	    }
	
	    return this.request<any>("request", "endGame", Object.assign(query, body),"gameId,token,score,singleGameLock,addScore,level".split(","),"gameId")
	}
	/**
	 * 
获取角色token信息(主要用于服务器内部调用)
	 * @param {string} gameId 玩家id
	 */
	getRoleToken(gameId: string):Promise<{code: ErrorCode,token: string}> {
	    let query = {
			gameId: gameId
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "getRoleToken", Object.assign(query, body),"gameId".split(","),"gameId")
	}
	/**
	 * 
查询道具数量
	 * @param {string} gameId 玩家id
	 * @param {string} token token
	 * @param {string} itemId itemId
	 */
	queryItemCount(gameId: string, token: string, itemId: string):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			token: token,
			itemId: itemId
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "queryItemCount", Object.assign(query, body),"gameId,token,itemId".split(","),"gameId")
	}
	/**
	 * 
添加游戏道具
	 * @param {string} gameId 玩家id
	 * @param {string} itemId itemId
	 * @param {number} count token
	 */
	addItem(gameId: string, itemId: string, count: number):Promise<{code: ErrorCode}> {
	    let query = {
			gameId: gameId,
			itemId: itemId,
			count: count
	    }
	
	    let body = {
	
	    }
	
	    return this.request<any>("request", "addItem", Object.assign(query, body),"gameId,itemId,count".split(","),"gameId")
	}
}

export class gameRPC {
    private static _inst: localgameRPC
    static async rpc_init(srv?:any) {
        if (!this._inst) this._inst = new localgameRPC("game", srv)
        return true;
    }

    static get inst() {
        if (!this._inst)  throw("need call rpc_init first game")
        return this._inst;
    }
}