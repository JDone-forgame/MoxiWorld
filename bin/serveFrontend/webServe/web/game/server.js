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
const define_1 = require("../../../../defines/define");
const makeGameSing_1 = require("../../../../lib/makeGameSing");
const gameRPC_1 = require("../../../../rpcs/gameRPC");
let server = class server {
    // 给玩家发道具接口，内部实现是直接放入玩家'背包'中
    additem(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let checklist = ['gameId', 'itemid', 'count', 'sign'];
            for (let i = 0; i < checklist.length; i++) {
                if (!param.hasOwnProperty(checklist[i])) {
                    return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: `can not find param [${checklist[i]}]` });
                }
            }
            if (makeGameSing_1.makeGameSing(param) != param.sign) {
                return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: `can not sign error` });
            }
            return gameRPC_1.gameRPC.inst.addItem(param.gameId, param.itemid, parseInt(param.count || '1'));
        });
    }
    // 给玩家发道具接口，内部实现是直接放入玩家'背包'中
    additems(param) {
        return __awaiter(this, void 0, void 0, function* () {
            let checklist = ['gameId', 'items', 'sign'];
            for (let i = 0; i < checklist.length; i++) {
                if (!param.hasOwnProperty(checklist[i])) {
                    return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: `can not find param [${checklist[i]}]` });
                }
            }
            if (makeGameSing_1.makeGameSing(param) != param.sign) {
                return Promise.reject({ code: define_1.ErrorCode.param_error, errMsg: `can not sign error` });
            }
            let items = param.items.split(',');
            for (let i = 0; i < items.length; i++) {
                let aItem = items[i].split(':');
                yield gameRPC_1.gameRPC.inst.addItem(param.gameId, aItem[0], parseInt(aItem[1] || '1'));
            }
            return { code: define_1.ErrorCode.ok };
        });
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.route()
], server.prototype, "additem", null);
__decorate([
    mx_webserve_1.WebRouteModule.route()
], server.prototype, "additems", null);
server = __decorate([
    mx_webserve_1.WebRouteModule.class(module)
], server);
//# sourceMappingURL=server.js.map