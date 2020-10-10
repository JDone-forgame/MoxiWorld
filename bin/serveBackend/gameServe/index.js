"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mx_rpc_1 = require("mx-rpc");
const gamerole_1 = require("./gamerole");
let game = class game {
    init() {
        gamerole_1.GameRoleService.init();
        return true;
    }
};
__decorate([
    mx_rpc_1.RPCHandle.init()
], game.prototype, "init", null);
game = __decorate([
    mx_rpc_1.RPCHandle.class('game', module)
], game);
//# sourceMappingURL=index.js.map