import { RPCHandle } from "mx-rpc";
import { GameRoleService } from "./gamerole";

@RPCHandle.class('game', module)
class game {
    @RPCHandle.init()
    public init(): boolean {
        GameRoleService.init();
        return true;
    }

}