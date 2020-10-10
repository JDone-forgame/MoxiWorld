"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sectruiy = void 0;
const crypto_1 = require("crypto");
const mx_tool_1 = require("mx-tool");
class Sectruiy {
    static makeGameSing(infos) {
        let signInfos = [];
        for (let key in infos) {
            if (key == 'sign')
                continue;
            if (infos[key] === undefined) {
                continue;
            }
            signInfos.push(key + '=' + infos[key]);
        }
        signInfos.sort(function (a, b) { return a > b ? 1 : -1; });
        return crypto_1.createHash("md5").update(signInfos.join('&') + mx_tool_1.ConfigMgr.get("appKey")).digest("hex");
    }
    static sign(in_appid, in_appkey, data) {
        let keylist = Object.keys(data).sort();
        let checklist = [];
        for (let i = 0; i < keylist.length; i++) {
            if (keylist[i] == 'sign')
                continue;
            checklist.push(`${keylist[i]}=${data[keylist[i]]}`);
        }
        return crypto_1.createHash("md5").update(in_appid + checklist.join('&') + in_appkey).digest("hex");
    }
    static signAssign(in_appid, in_appkey, data) {
        return Object.assign(data, { sign: this.sign(in_appid, in_appkey, data) });
    }
}
exports.Sectruiy = Sectruiy;
//# sourceMappingURL=security.js.map