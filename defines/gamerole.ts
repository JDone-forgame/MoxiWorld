
export interface ifUnitRole {
    openId: string;
    sessionKey: string;
    gameId: any;
    gameInfo: any;
    gameCount: any;
    nickName: string;
    avatarUrl: string;
    level: number;
    newMails: string[];
    mailInfos: ifMailInfo[];
    tasks: iTaskInfo[];
    teamID: string,
    lastLeaveTeamTime: number,
    items: {
        [itemId: string]: number;
    };
    hightScore: number;
    totalScore: number;
    playCount: number;
    isNew: boolean;
    beneficiaryId: string;
    invateReward: number;
    starNum: number;
    allLevels: iLevelInfo[];
    strengthStartGrowTime: number;
    invateRewardCnt: number;
    teamRewarded: number[];
    activityStartTime: number;
    activityEndTime: number;
    advStrengthNum: number;
    advPilNum: number;
    advRandNum: number;
    lastStrengthResetTime: number;
    signin: any;
}

/**
 * 邮件类型
 */
export enum eMailType {
    /** 系统邮件 */
    System,
    /** 用户邮件 */
    User,
    /**道具邮件 */
    Proto,
}

/**
 * 体力值类型
 */
export enum StrengthRecoveryType {
    /** 根据cd值刷新体力*/
    StrengthRecoveryByCd = 1,
    /** 每日刷新体力*/
    StrengthRrcoveryDay = 2
}

/**
 * 邮件功能类型
 */
export enum eMailFunctionType {
    /** 分享奖励体力 */
    ShareRewardStrength,
    /** 淘宝平台奖励提示 */
    TaobaoRewardTip,
    /** 邀请新人注册奖励 */
    InviteRisterReward,

    platformItems,
}

export interface ifMailContent {
    type: eMailFunctionType,
    date: number,
    title: string;
    content: string;
    rewardItems: Array<string>;
    read: boolean;
    claimed: boolean;
    extra?: any;
}

export interface ifMailInfo {
    /** 邮件类型 */
    type: eMailType,
    // 邮件的id唯一
    mailId: string,
    // 收件人
    ownerId: string,
    // 发件人
    senderId: string,
    // 内容
    message: ifMailContent,
    // 发件时间
    time: number,
    // 邮件状态
    state: number
}


export enum eShopBuyType {
    Gold,
    Diamond,
}


export enum RewardStatus {
    UnComplete,
    CanReward,
    Rewarded,
}

/**
 * 广告奖励类型
 */
export enum eAdvAwardType {
    Strength,
    Pil,
    RandItem,
}

export interface RewardsInfo {
    taskId: string,
    rewards: Array<string>
}

/**
 * 任务信息
 */
export interface iTaskInfo {
    // 任务id
    taskId: string,
    // 已经完成数量
    completeCount: number,
    // 总数量
    totalCount: number,
    // 是否领取过奖励
    rewardStatus: RewardStatus,

    // 奖励物品
    rewards: Array<string>,
    // 是否领取过加倍奖励
    adRewarded: boolean,
}

/**
 * 过关信息
 */
export interface iLevelInfo {
    id: string,
    highStarNum: number,
    rewardClaimed: boolean,
    pass: boolean,
}

/**
 * 成就信息
 */
export interface iAchievementInfo {
    // 成就id
    acId: string,
    // 完成值
    completeVaule: number,
    // 已经领取奖励的阶段
    awardStages: Array<number>,
    // 是否已经解锁
    isUnlock: boolean,
}

/**
 * 签到信息
 */
export interface ifSignin {
    day: number,
    time: number,
    dayCount: number,
    totalCount: number,
    awardID: string,
}