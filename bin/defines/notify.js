"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeEvent = void 0;
/**
 * 消息订阅类型
 * 注意：需要保持数据库，一旦定义不得修改
 */
var SubscribeEvent;
(function (SubscribeEvent) {
    SubscribeEvent[SubscribeEvent["none"] = 0] = "none";
    /** 时间触发开始 */
    SubscribeEvent[SubscribeEvent["time_begin"] = 1] = "time_begin";
    SubscribeEvent[SubscribeEvent["time_strength_full"] = 2] = "time_strength_full";
    /** 时间触发结束 */
    SubscribeEvent[SubscribeEvent["time_end"] = 9999] = "time_end";
    /** 事件触发开始 */
    SubscribeEvent[SubscribeEvent["event_begin"] = 10000] = "event_begin";
    SubscribeEvent[SubscribeEvent["event_invite_give_strength"] = 10001] = "event_invite_give_strength";
    /** 事件触发结束 */
    SubscribeEvent[SubscribeEvent["event_end"] = 19999] = "event_end";
})(SubscribeEvent = exports.SubscribeEvent || (exports.SubscribeEvent = {}));
//# sourceMappingURL=notify.js.map