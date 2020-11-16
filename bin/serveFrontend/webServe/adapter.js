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
let adapter = class adapter {
    before(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let uid = req.params.gameId;
            if (!uid) {
                let info = req.params.info;
                if (info && info["userId"]) {
                    uid = info["userId"];
                }
            }
            req.reqID = logger_1.LoggerMoudle.apiBegin(req.path, req.method, uid, req.params);
        });
    }
    after(req, res) {
        if (req.reqID)
            logger_1.LoggerMoudle.apiEnd(req.reqID, true, req.responseData);
    }
};
__decorate([
    mx_webserve_1.WebRouteModule.envBefore()
], adapter.prototype, "before", null);
__decorate([
    mx_webserve_1.WebRouteModule.envAfter()
], adapter.prototype, "after", null);
adapter = __decorate([
    mx_webserve_1.WebRouteModule.envClass("mx")
], adapter);
//# sourceMappingURL=adapter.js.map