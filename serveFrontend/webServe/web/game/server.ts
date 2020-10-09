import { WebRouteModule } from "mx-webserve";
import { ErrorCode } from "../../../../defines/define";
import { makeGameSing } from "../../../../lib/makeGameSing";
import { gameRPC } from "../../../../rpcs/gameRPC";

@WebRouteModule.class(module)
class server {

    // 给玩家发道具接口，内部实现是直接放入玩家'背包'中
    @WebRouteModule.route()
    async additem(param: { [key: string]: string }) {
        let checklist = ['gameId', 'itemid', 'count', 'sign'];
        for (let i = 0; i < checklist.length; i++) {
            if (!param.hasOwnProperty(checklist[i])) {
                return Promise.reject({ code: ErrorCode.param_error, errMsg: `can not find param [${checklist[i]}]` });
            }
        }

        if (makeGameSing(param) != param.sign) {
            return Promise.reject({ code: ErrorCode.param_error, errMsg: `can not sign error` });
        }
        return gameRPC.inst.addItem(param.gameId, param.itemid, parseInt(param.count || '1'))
    }

    // 给玩家发道具接口，内部实现是直接放入玩家'背包'中
    @WebRouteModule.route()
    async additems(param: { [key: string]: string }) {
        let checklist = ['gameId', 'items', 'sign'];
        for (let i = 0; i < checklist.length; i++) {
            if (!param.hasOwnProperty(checklist[i])) {
                return Promise.reject({ code: ErrorCode.param_error, errMsg: `can not find param [${checklist[i]}]` });
            }
        }

        if (makeGameSing(param) != param.sign) {
            return Promise.reject({ code: ErrorCode.param_error, errMsg: `can not sign error` });
        }
        
        let items = param.items.split(',')
        for (let i = 0; i < items.length; i++) {
            let aItem = items[i].split(':')
            await gameRPC.inst.addItem(param.gameId, aItem[0], parseInt(aItem[1] || '1'))
        }

        return { code: ErrorCode.ok }
    }
}