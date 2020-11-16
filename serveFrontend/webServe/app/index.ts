import { ConfigMgr } from "mx-tool";
import { join } from "path"
import { WebRouteModule } from "mx-webserve"
import { RPCHandle } from "mx-rpc";

export var name = "webServe"

@RPCHandle.class("webServe", module)
class web {
    @RPCHandle.init()
    init() {

        if (ConfigMgr.get("host") && ConfigMgr.get("Swagger")) {
            try {
                WebRouteModule.openSwagger({ basedir: join(__dirname, '..'), ext: ".js", routePath: "web", title: "摩西世界", host: ConfigMgr.get("host") })
            }
            catch (e) {

            }
        }

        require("../adapter")
        WebRouteModule.openCross();
        return WebRouteModule.init(ConfigMgr.get("web"), join(__dirname, '..', 'web'), function () {
            return ConfigMgr.get("channel") || ""
        })
    }
}
