"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    static map2Obj(aMap) {
        let obj = Object.create(null);
        aMap.forEach((value, key, map) => {
            obj[key] = value;
        });
        return obj;
    }
    static obj2map(obj) {
        let map = new Map();
        for (let k of Object.keys(obj)) {
            map.set(k, obj[k]);
        }
        return map;
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map