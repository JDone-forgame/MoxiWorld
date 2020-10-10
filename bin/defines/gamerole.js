"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eAdvAwardType = exports.RewardStatus = exports.eShopBuyType = exports.eMailFunctionType = exports.StrengthRecoveryType = exports.eMailType = void 0;
/**
 * 邮件类型
 */
var eMailType;
(function (eMailType) {
    /** 系统邮件 */
    eMailType[eMailType["System"] = 0] = "System";
    /** 用户邮件 */
    eMailType[eMailType["User"] = 1] = "User";
    /**道具邮件 */
    eMailType[eMailType["Proto"] = 2] = "Proto";
})(eMailType = exports.eMailType || (exports.eMailType = {}));
/**
 * 体力值类型
 */
var StrengthRecoveryType;
(function (StrengthRecoveryType) {
    /** 根据cd值刷新体力*/
    StrengthRecoveryType[StrengthRecoveryType["StrengthRecoveryByCd"] = 1] = "StrengthRecoveryByCd";
    /** 每日刷新体力*/
    StrengthRecoveryType[StrengthRecoveryType["StrengthRrcoveryDay"] = 2] = "StrengthRrcoveryDay";
})(StrengthRecoveryType = exports.StrengthRecoveryType || (exports.StrengthRecoveryType = {}));
/**
 * 邮件功能类型
 */
var eMailFunctionType;
(function (eMailFunctionType) {
    /** 分享奖励体力 */
    eMailFunctionType[eMailFunctionType["ShareRewardStrength"] = 0] = "ShareRewardStrength";
    /** 淘宝平台奖励提示 */
    eMailFunctionType[eMailFunctionType["TaobaoRewardTip"] = 1] = "TaobaoRewardTip";
    /** 邀请新人注册奖励 */
    eMailFunctionType[eMailFunctionType["InviteRisterReward"] = 2] = "InviteRisterReward";
    eMailFunctionType[eMailFunctionType["platformItems"] = 3] = "platformItems";
})(eMailFunctionType = exports.eMailFunctionType || (exports.eMailFunctionType = {}));
var eShopBuyType;
(function (eShopBuyType) {
    eShopBuyType[eShopBuyType["Gold"] = 0] = "Gold";
    eShopBuyType[eShopBuyType["Diamond"] = 1] = "Diamond";
})(eShopBuyType = exports.eShopBuyType || (exports.eShopBuyType = {}));
var RewardStatus;
(function (RewardStatus) {
    RewardStatus[RewardStatus["UnComplete"] = 0] = "UnComplete";
    RewardStatus[RewardStatus["CanReward"] = 1] = "CanReward";
    RewardStatus[RewardStatus["Rewarded"] = 2] = "Rewarded";
})(RewardStatus = exports.RewardStatus || (exports.RewardStatus = {}));
/**
 * 广告奖励类型
 */
var eAdvAwardType;
(function (eAdvAwardType) {
    eAdvAwardType[eAdvAwardType["Strength"] = 0] = "Strength";
    eAdvAwardType[eAdvAwardType["Pil"] = 1] = "Pil";
    eAdvAwardType[eAdvAwardType["RandItem"] = 2] = "RandItem";
})(eAdvAwardType = exports.eAdvAwardType || (exports.eAdvAwardType = {}));
//# sourceMappingURL=gamerole.js.map