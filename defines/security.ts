
import { createHash } from "crypto";
import { ConfigMgr } from "mx-tool";
export class Sectruiy{
    
    static makeGameSing(infos: { [key: string]: string }) {
        let signInfos: string[] = []
        for (let key in infos) {
            if (key == 'sign') continue;
            if (infos[key] === undefined) {
                continue;
            }
            signInfos.push(key + '=' + infos[key])
        }

        signInfos.sort(function (a, b) { return a > b ? 1 : -1 });

        return createHash("md5").update(signInfos.join('&') + ConfigMgr.get("appKey")).digest("hex");
    }

    static sign(in_appid: string, in_appkey: string,  data: { [key: string]: (number | string) }) {
        let keylist = Object.keys(data).sort();
        let checklist = [];
        for (let i = 0; i < keylist.length; i++) {
            if (keylist[i] == 'sign') continue;
            checklist.push(`${keylist[i]}=${data[keylist[i]]}`);
        }

        return createHash("md5").update(in_appid + checklist.join('&') + in_appkey).digest("hex");
    }

    static signAssign(in_appid: string, in_appkey: string, data: { [key: string]: (number | string) }) {
        return Object.assign(data, { sign: this.sign(in_appid, in_appkey, data) })
    }
}