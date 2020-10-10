"use strict";
/*
 * @Description: 事件ID定义
 * @Author: chenguanhui
 * @Date: 2019-08-13 19:31:22
 * @LastEditors: chenguanhui
 * @LastEditTime: 2019-08-13 19:31:49
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventId = void 0;
exports.EventId = {
    /**
     * 切换场景
     */
    CHANGE_SCENE: 'EventId.CHANGE_SCENE',
    /**
     * 确认框确认选择
     */
    EVENT_CONFIRM: 'EventId.EVENT_CONFIRM',
    /**
     * 屏幕朝向改变
     */
    ON_ORIENTATION_CHANGE: "EventId.ON_ORIENTATION_CHANGE",
    /**
     * 开始切菜
     */
    ON_START_CUT: "EventId.ON_START_CUT",
    /**
     * 停止切菜
     */
    ON_STOP_CUT: "EventId.ON_STOP_CUT",
    /**
    * 切或者扔正确操作
    */
    ON_CUT_THROW_SUCCESS: "EventId.ON_CUT_THROW_SUCCESS",
    /**
     * 切或者扔错误操作
     */
    ON_CUT_THROW_FAIL: "EventId.ON_CUT_THROW_FAIL",
    /**
     * 播放完成
     */
    ON_PLAY_COMPETE: "EventId.ON_PLAY_COMPETE",
    /**
     * 生成一个水果
     */
    ON_GEN_FRUIT: "EventId.ON_GEN_FRUIT",
    /**
     * 切菜抖动
     */
    ON_CUT_VIBRATE: "EventId.ON_CUT_VIBRATE",
    /**
     * 刷新金币
     */
    ON_GOLD_REFRESH: "EventId.ON_GOLD_REFRESH",
    /**
     * 刷新钻石
     */
    ON_DIAMOND_REFRESH: "EventId.ON_DIAMOND_REFRESH",
    /**
    * 刷新收益
    */
    ON_REVENUE_INFO_REFRESH: "EventId.ON_REVENUE_INFO_REFRESH",
    /**
     * 在砧板上显示一个菜刀
     */
    ON_SHOW_KNIFE_CHOPPINGBOARD: "EventId.ON_SHOW_KNIFE_CHOPPINGBOARD",
    /**
     * 任务数据变化
     */
    ON_TASK_DATA_CHANGE: "EventId.ON_TASK_DATA_CHANGE",
    /**
     * 切换菜刀
     */
    ON_CHANGE_KNIFE: "EventId.ON_CHANGE_KNIFE",
    /**
     * 刷新当前可购买的菜刀
     */
    ON_REFRESH_CURRENT_BUY_KNIFE: 'EventId.ON_REFRESH_CURRENT_BUY_KNIFE',
    /**
     * 下一步引导触发
     */
    ON_GUIDE_NEXT_TRIGGER: 'EventId.ON_GUIDE_NEXT_TRIGGER',
    /**
     * UI打开事件
     */
    ON_UI_OPEN: 'EventId.EVENT_ON_UI_OPEN',
    /**
     * UI关闭事件
     */
    ON_UI_CLOSE: 'EventId.EVENT_ON_UI_CLOSE',
    /**
     * 引导播放UI动画
     */
    ON_GUIDE_UI_PLAY_ANI: 'EventId.ON_GUIDE_UI_PLAY_ANI',
    /**
     * 引导UI打开
     */
    ON_GUIDE_UI_OPEN: 'EventId.ON_GUIDE_UI_OPEN',
    /**
    * 更新加载进度
    */
    ON_UPDATE_LOADING_PROGRESS: 'EventId.ON_UPDATE_LOADING_PROGRESS',
    /**
     * 更新加载提示
     */
    ON_UPDATE_LOADING_TTP: 'EventId.ON_UPDATE_LOADING_TTP',
    /**
     * 登录返回
    */
    ON_LOGIN_RET: 'EventId.ON_LOGIN_RET',
    /**
    * 逻辑变化通知客户端更新
    */
    ON_L2C_START_GAME: "EventId.ON_L2C_START_GAME",
    ON_L2C_RESTART_GAME: "EventId.ON_L2C_RESTART_GAME",
    ON_L2C_ELIM_ERROR: "EventId._ON_L2C_ELIM_ERROR",
    ON_L2C_USE_PROP_ERROR: "EventId.ON_L2C_USE_PROP_ERROR",
    //ON_L2C_ELIM_BLOCKS: "EventId._ON_L2C_ELIM_BLOCKS",
    //ON_L2C_ELIM_SPEICAL: "EventId._ON_L2C_ELIM_SPECIALS",
    //ON_L2C_BLOCKS_FALL: "EventId._ON_L2C_BLOCKS_FALL",
    //ON_L2C_BLOCKS_AUTO_REFILL: "EventId._ON_L2C_BLOCKS_AUTO_REFILL",
    //ON_L2C_GEN_BLOCK: "EventId._ON_L2C_GEN_BLOCK",
    //ON_L2C_GEN_EFFECT_MUJI: "EventId._ON_L2C_GEN_EFFECT_MUJI",//母鸡的效果
    //ON_L2C_BLOCK_DROP: "EventId._ON_L2C_BLOCK_DROP",//足球掉落的通知
    //ON_L2C_USE_PROP_SUCCESS: "EventId.ON_L2C_USE_PROP_SUCCESS",//使用道具成功
    ON_L2C_RESULT: "EventId.ON_L2C_RESULT",
    ON_L2C_CANTFIND: 'EventId.ON_L2C_CANTFIND',
    // 客户端内部通信
    /**
     * 更新操作次数
     */
    ON_STEP_UPDATE: "EventId.ON_STEP_UPDATE",
    /**
     * 设置游戏目标
     */
    ON_SET_TARGET: "EventId.ON_SET_TARGET",
    /**
     * 更新游戏目标数
     */
    ON_UPDATE_TARGET_NUMBER: 'EventId.ON_UPDATE_TARGET_NUMBER',
    /**
     * 更新游戏分数
     */
    ON_UPDATE_SCORE: 'EventId.ON_UPDATE_SCORE',
    /**
     * 特效播放到关键帧
     */
    ON_EFFECT_PLAY_KEY_FRAME: 'EventId.ON_EFFECT_PLAY_KEY_FRAME',
    /**
     * 完成当前步骤
     */
    ON_STEP_FINISH: "EventId.ON_STEP_FINISH",
    /**
     * 作为动作方块完成合成动作
     */
    ON_FINISH_COMPOUND: "EventId.ON_FINISH_COMPOUND",
    /**
     * 作为合成中心开始合成
     */
    ON_COMPOUND_CENTER: "EventId.ON_COMPOUND_CENTER",
    /**
     * 合成动画完成
     */
    ON_HECHENG_ACTION: 'EventId.ON_HECHENG_ACTION',
    /**
     * 气泡动画
     */
    ON_BUBBLE_ACTION: 'EventId.ON_BUBBLE_ACTION',
    /**
     * 火箭消除
     */
    ON_ROCKET_ACTION: 'EventId.ON_ROCKET_ACTION',
    /**
     * 火箭特效开始
     */
    ON_ROCKET_START: 'EventId.ON_ROCKET_START',
    /**
     * 炸弹消除
     */
    ON_BOMB_ACTION: 'EventId.ON_BOMB_ACTION',
    /**
     * 特殊消除结束
     */
    ON_SPECIALELIM_FINISH: 'EventId.ON_SPECIALELIM_FINISH',
    /**
     * 星球特效开始
     */
    ON_STAR_ACTION: 'EventId.ON_STAR_ACTION',
    /**
     * 星球消除方块完成飞行
     */
    ON_FINISH_STAR_FLY: 'EventId.ON_FINISH_STAR_FLY',
    /**
     * 所有方块完成飞行
     */
    ON_FINISH_FLY_ALL: 'EventId.ON_FINISH_FLY_ALL',
    /**
     * 合成准备完成
     */
    ON_COMBO_READY: 'EventId.ON_COMBO_READY',
    /**
     * 星球组合开始
     */
    ON_STARCOMBO_BEGIN: 'EventId.ON_STARCOMBO_BEGIN',
    /**
     * 星球组合方块生成结束
     */
    ON_STARCOMBO_BLOCK_FINISH: 'EventId.ON_STARCOMBO_BLOCK_FINISH',
    /**
     * 更新星星数量
     */
    ON_UPDATE_STAR: 'EventId.ON_UPDATE_STAR',
    /**
     * 更新体力
     */
    ON_UPDATE_STENGTH: 'EventId.ON_UPDATE_STENGTH',
    /*
     * 星球组合动画播放完最后一个动画
     */
    ON_STARCOMBO_LASTANI_FINISH: 'EventId.ON_STARCOMBO_LASTANI_FINISH',
    /**
     * 星球星球组合开始
     */
    ON_DOUBLESTAR_BEGIN: 'EventId.ON_DOUBLESTAR_BEGIN',
    /**
     * 星球星球组合结束
     */
    ON_DOUBLESTAR_FINISH: 'EventId.ON_DOUBLESTAR_FINISH',
    /**
     * 飞机道具开始消除
     */
    ON_PROP_VERTICAL_STARTELIM: 'EventId.ON_PROP_VERTICAL_STARTELIM',
    /**
     * 重置普通方块位置
     */
    ON_RESETBLOCK_POSITION: 'EventId.ON_RESETBLOCK_POSITION',
    /**
     * 重新开始游戏
     */
    ON_GAME_RESTART: 'EventId.ON_GAME_RESTART',
    // /**
    //  * 步数转火箭
    //  */
    // ON_STEP2ROCKET_STAR:'EventId.ON_STEP2ROCKET_STAR',
    /**
     * 关卡选择界面切换关卡阶段
     */
    ON_LEVEL_STAGE_CLICK: 'EventId.ON_LEVEL_STAGE_CLICK',
    /**
     * 播放鸡毛特效
     */
    ON_CHICKENHAIR_PLAY: 'EventId.ON_CHICKENHAIR_PLAY',
    /**
     * 达到目标所有母鸡睡觉
     */
    ON_CHICKEN_SLEEP: 'EventId.ON_CHICKEN_SLEEP',
    /**
     * 火箭炸弹波及方块效果
     */
    ON_SPREAD_BLOCKS: 'EventId.ON_SPREAD_BLOCKS',
    /**
     * 水管消除方块放到最后一个动画播完(2020 2.26)
     */
    ON_PIPE_ELIMALLBLOCKS: 'EventId.ON_PIPE_ELIMALLBLOCKS',
    /**
     *  更新队伍信息
     */
    ON_UPDATE_TEAM_INFO: 'EventId.ON_UPDATE_TEAM_INFO',
    /**
     * 主界面获得星星动画
     */
    ON_PLAY_GETSTAR_ANI: 'EventId.ON_PLAY_GETSTAR_ANI',
    /**
     * 向主界面发送播放星星动画
     */
    ON_MAIN_PLAY_STAR_ANI: 'EventId.ON_MAIN_PLAY_STAR_ANI',
    /**
     * 道具更新
     */
    ON_ITEM_UPDATE: 'EventId.ON_ITEM_UPDATE',
    /**
     * 客户端内部通知游戏结束
     */
    ON_GAME_FINISH: 'EventId.ON_GAME_FINISH',
    /**
     * 体力不足界面跳转到任务
     */
    ON_GOTO_TASK: 'EventId.ON_GOTO_TASK',
    /**
     *  游戏状态改变
     */
    ON_GAME_ACTION_STATE_CHANGE: 'EventId.ON_GAME_ACTION_STATE_CHANGE',
    /**
     * 任务红点提醒
     */
    ON_TASK_TIPS: 'EventId.ON_TASK_TIPS',
    /**
     * 组队红点提醒
     */
    ON_TEAM_TIPS: 'EventId.ON_TEAM_TIPS',
    /**
     * 主界面母鸡落地
     */
    ON_CHICKEN_DOWN: 'EventId.ON_CHICKEN_DOWN',
    /**
     * 领取关卡奖励完成
     */
    ON_FINISH_GETLEVELREWARD: 'EventId.ON_FINISH_GETLEVELREWARD',
    /**
     * 播放主界面母鸡动画
     */
    ON_PLAY_HOME_CHICKEN: 'EventId.ON_PLAY_HOME_CHICKEN',
    /**
     * 引导界面母鸡动画
     */
    ON_GUIDECHICKEN_ANI_FINISH: 'EventId.ON_GUIDECHICKEN_ANI_FINISH',
    /**
     * 切换标签结束
     */
    ON_CHANGE_PAGE_FINISH: 'EventId.ON_CHANGE_PAGE_FINISH',
    /**
     * 排行版数据变化
     */
    ON_RANKINFO_UPDATE: 'EventId.ON_RANKINFO_UPDATE',
    /**
     * 刷新邀请奖励
     */
    ON_REFRESH_INVITE_REWARD: "EventId.ON_REFRESH_INVITE_REWARD",
    /**
     * home界面打开体力不足界面
     */
    ON_OPEN_LESSSTRE: "EventId.ON_OPEN_LESSSTRE",
    /**
     * 关注店铺信息更新
     */
    ON_FOLLOW_INFO_UPDATE: "EventId.ON_FOLLOW_INFO_UPDATE",
    /**
     * 从小程序界面返回
     */
    ON_BACK_TO_GAME: "EventId.ON_BACK_TO_GAME",
    /**
     * 使用药丸道具
     */
    ON_USE_PILL: 'EventId.ON_USE_PILL',
    /**
     * 引导点击道具
     */
    ON_GUIDE_PROP_CLICK: 'EventId.ON_GUIDE_PROP_CLICK',
    /**
     * 点击进入游戏
     */
    ON_CLICK_ENTER_LEVEL: "EventId.ON_CLICK_ENTER_LEVEL",
    /**
     * 获取邀请邮件成功
     */
    ON_GET_USER_INVITE_EMAIL: "EventId.ON_GET_USER_INVITE_EMAIL",
    /**
     * 检查关注店铺
     */
    ON_CHECK_FOLLOW: "EventId.ON_CHECK_FOLLOW",
    /**
     * 邮件获取道具
     */
    ON_GET_ITEMS_BY_EMAIL: 'EventId.ON_GET_ITEMS_BY_EMAIL',
    /**
     * 方块发生延展
     */
    ON_BLOCK_STRETCHED: 'EventId.ON_BLOCK_STRETCHED',
    /**
     * 滑动到固定的页面
     */
    ON_SCROLL_TO_LEVEL: 'EventId.ON_SCROLL_TO_LEVEL',
    /**
     * 观看广告成功复活
     */
    ON_WATCH_AD_BY_LESSPILLWIN: 'EventId.ON_WATCH_AD_BY_LESSPILLWIN',
    /**
     * 观看广告获得体力
     */
    ON_WATCH_AD_BY_LESSSTRENGTH: 'EventId.ON_WATCH_AD_BY_LESSSTRENGTH',
};
//# sourceMappingURL=EventId.js.map