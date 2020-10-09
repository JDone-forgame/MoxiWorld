/**
 * 消息订阅类型
 * 注意：需要保持数据库，一旦定义不得修改
 */
export enum SubscribeEvent {
    none = 0,

    /** 时间触发开始 */ 
    time_begin = 1,

    time_strength_full = 2, // 体力值已满

    /** 时间触发结束 */ 
    time_end = 10000 - 1,


    /** 事件触发开始 */ 
    event_begin = 10000,

    event_invite_give_strength = 10001,    // 好友邀请赠送体力

    /** 事件触发结束 */ 
    event_end = 20000 - 1,  
}