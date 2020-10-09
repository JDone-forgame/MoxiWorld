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
const mx_webserve_1 = require("mx-webserve");
const logger_1 = require("../../lib/logger");
const encode_decode_1 = require("../../lib/encode-decode");
const crypto_1 = require("crypto");
const define_1 = require("../../defines/define");
const gameRPC_1 = require("../../rpcs/gameRPC");
let _ = class _ {
    before(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // 这里增加一个数据加密的流程数据采用对称加密，加密需要的条件是
            let params = req.params;
            if (params.__id__ && params.__data__ && params.__iv__) {
                // 需要通过加密验证流程
                let role = yield gameRPC_1.gameRPC.inst.getRoleToken(params.__id__);
                let passkey = role.token.slice(8, 16) + role.token.slice(24, 32);
                let enpasskey = crypto_1.createHash("md5").update(params.__id__).digest("hex").slice(0, 16);
                try {
                    let info = encode_decode_1.AesDecode(passkey, params.__data__, params.__iv__);
                    req.params = JSON.parse(info);
                    req.params.__encode__ = enpasskey;
                }
                catch (e) {
                    throw { code: define_1.ErrorCode.role_token_error, errMsg: "token error parse message error" };
                }
            }
            // 获取角色id
            let uid = req.params.gameId;
            if (!uid) {
                let info;
                if (typeof req.params.info != 'object') {
                    try {
                        info = JSON.parse(req.params.info);
                    }
                    catch (e) {
                    }
                }
                else {
                    info = req.params.info;
                }
                if (info && info["userId"]) {
                    uid = info["userId"];
                }
            }
            req.reqID = logger_1.LoggerInstance.apiBegin(req.path, req.method, uid, req.params);
        });
    }
    after(req, res) {
        if (req.reqID)
            logger_1.LoggerInstance.apiEnd(req.reqID, true, req.responseData);
        if (req.params.__encode__) {
            let data = req.responseData;
            if (typeof data == "object") {
                data = JSON.stringify(data);
            }
            try {
                // 压缩了还回去
                let info = encode_decode_1.AesEncode(req.params.__encode__, data);
                req.responseData = {
                    __data__: info.encryptedData,
                    __iv__: info.iv
                };
            }
            catch (e) {
                // 失败的话走明文
            }
        }
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.globalBefore()
], _.prototype, "before", null);
__decorate([
    mx_webserve_1.WebRouteModule.globalAfter()
], _.prototype, "after", null);
_ = __decorate([
    mx_webserve_1.WebRouteModule.globalClass()
], _);
//# sourceMappingURL=adapter.js.map