export class Util{
    
    public static map2Obj(aMap: Map<any, any>): Object {
        let obj = Object.create(null);
        aMap.forEach((value, key, map) => {
            obj[key] = value;
        })
        return obj;
    }

    public static obj2map(obj: Object): Map<any, any> {
        let map = new Map();
        for (let k of Object.keys(obj)) {
            map.set(k, obj[k]);
        }
        return map;
    }
}