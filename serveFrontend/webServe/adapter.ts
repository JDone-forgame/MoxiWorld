import { WebRouteModule, Response, Request } from "mx-webserve";
import { RequestEx } from "mx-webserve/src/webHandle";
import { LoggerInstance } from "../../lib/logger";
import { AesDecode, AesEncode } from "../../lib/encode-decode"
import { createHash } from "crypto";
import { ErrorCode } from "../../defines/define"
import { gameRPC } from "../../rpcs/gameRPC"


interface RequestExE extends RequestEx {
    reqID?: string
}

@WebRouteModule.globalClass()
class _ {
    @WebRouteModule.globalBefore()
    async before(req: RequestExE, res: Response) {
        // 这里增加一个数据加密的流程数据采用对称加密，加密需要的条件是
        let params = req.params as any;
        if (params.__id__ && params.__data__ && params.__iv__) {
            // 需要通过加密验证流程
            let role = await gameRPC.inst.getRoleToken(params.__id__);
            let passkey = role.token.slice(8, 16) + role.token.slice(24, 32);
            let enpasskey = createHash("md5").update(params.__id__).digest("hex").slice(0,16);
            try {
                let info = AesDecode(passkey, params.__data__, params.__iv__);
                req.params = JSON.parse(info);
                req.params.__encode__ = enpasskey;
            }
            catch (e) {
                throw { code: ErrorCode.role_token_error, errMsg: "token error parse message error" }
            }
        }


       // 获取角色id
       let uid: any = req.params.gameId
       if (!uid) {
           let info: any;
           if (typeof req.params.info != 'object') {
               try {
                  info = JSON.parse(req.params.info);
               }
               catch (e) {
                   
               }
           } else {
               info = req.params.info;
           }

           if (info && info["userId"])  {
               uid = info["userId"];
           }
       }
       req.reqID = LoggerInstance.apiBegin(req.path, req.method, uid, req.params)
    }
    
    @WebRouteModule.globalAfter()
    after(req: RequestExE, res: Response) {
        if (req.reqID) LoggerInstance.apiEnd(req.reqID, true, req.responseData)
        if (req.params.__encode__) {
            let data = req.responseData;
            if (typeof data == "object") {
                data = JSON.stringify(data);
            }
            try {
                // 压缩了还回去
                let info = AesEncode(req.params.__encode__, data);
                req.responseData = {
                    __data__: info.encryptedData,
                    __iv__: info.iv
                }
            }
            catch (e) {
                // 失败的话走明文
            }
        }
    }
}