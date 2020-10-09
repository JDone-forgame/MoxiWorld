"use strict";
// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStartItem = exports.RaceAction = exports.PropType = exports.eElimateType = exports.ActionType = exports.LevelParam = exports.GameConst = exports.ResourceType = exports.ActionTag = exports.BlockType = void 0;
/**
  * 一些单局元素定义
  */
var BlockType;
(function (BlockType) {
    BlockType["Null"] = "A000";
    BlockType["Red"] = "A001";
    BlockType["Blue"] = "A002";
    BlockType["Yellow"] = "A003";
    BlockType["Green"] = "A004";
    BlockType["Purple"] = "A005";
    BlockType["Orange"] = "A006";
    BlockType["Bomb"] = "A007";
    BlockType["BigBomb"] = "A008";
    BlockType["RowRocket"] = "A009";
    BlockType["ColRocket"] = "A010";
    BlockType["All_Red"] = "A011";
    BlockType["All_Blue"] = "A012";
    BlockType["All_Yellow"] = "A013";
    BlockType["All_Green"] = "A014";
    BlockType["All_Purple"] = "A015";
    BlockType["All_Orange"] = "A016";
    BlockType["Bubble"] = "B001";
    BlockType["Terrain"] = "C001";
    BlockType["Empty"] = "C002";
    BlockType["MuTong_1"] = "A018";
    BlockType["MuTong_2"] = "A019";
    BlockType["MuTong_3"] = "A020";
    BlockType["MuXiang_1"] = "A030";
    BlockType["Muxiang_2"] = "A031";
    BlockType["Muxiang_3"] = "A032";
    BlockType["DoubleRocket"] = "D001";
    BlockType["BombRocket"] = "D002";
    BlockType["DoubleBomb"] = "D003";
    BlockType["StarRocket"] = "D004";
    BlockType["StarBomb"] = "D005";
    BlockType["DoubleStar"] = "D006";
    BlockType["IceWithRed2"] = "A025";
    BlockType["IceWithRed1"] = "A024";
    BlockType["Ball"] = "A017";
    BlockType["BigBall_upLeft"] = "A026";
    BlockType["BigBall_upRight"] = "A027";
    BlockType["BigBall_downLeft"] = "A028";
    BlockType["BigBall_downRight"] = "A029";
    BlockType["IceWithBall1"] = "A033";
    BlockType["IceWithBomb1"] = "A034";
    BlockType["IceWithRocketRow1"] = "A035";
    BlockType["IceWithRocketCol1"] = "A036";
    BlockType["IceWithCask11"] = "A037";
    BlockType["IceWithCask21"] = "A038";
    BlockType["IceWithCask31"] = "A039";
    BlockType["IceWithYellow1"] = "A040";
    BlockType["IceWithBlue1"] = "A041";
    BlockType["IceWithHorse"] = "A044";
    BlockType["BlockPoison"] = "A045";
    BlockType["ChiChen"] = "A023";
    BlockType["BlockDiglett1"] = "A047";
    BlockType["BlockDiglett2"] = "A048";
    BlockType["BlockTurtle"] = "A049";
    BlockType["BlcokWatermelonBig"] = "A052";
    BlockType["BlockWatermelonSmall"] = "A051";
    BlockType["BlockIceWatermelon"] = "A053";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
var ActionTag;
(function (ActionTag) {
    ActionTag[ActionTag["Block_ClickError"] = 0] = "Block_ClickError";
    ActionTag[ActionTag["Block_Falling"] = 1] = "Block_Falling";
    ActionTag[ActionTag["Block_Compound"] = 2] = "Block_Compound";
})(ActionTag = exports.ActionTag || (exports.ActionTag = {}));
var ResourceType;
(function (ResourceType) {
    //值和blockType错开
    ResourceType[ResourceType["NULL"] = 10000] = "NULL";
    ResourceType[ResourceType["Grid"] = 10001] = "Grid";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
exports.GameConst = {
    //逻辑
    MaxRow: 9,
    MaxCol: 9,
    MaxColorCount: 6,
    //显示
    BlockDropSpeed: 15,
    BlockAutoFillSpeed: 18,
    GridSize: 70,
    DropDelRow: 6,
};
exports.LevelParam = {
    MaxRow: 'maxrow',
    MaxCol: 'maxcol',
    ColorCount: 'colorcount',
    Level: 'level',
    Block: 'block',
    Bot: 'bot',
    Top: 'top',
    BlockRow: 'row',
    BlockCol: 'col',
    BlockType: 'type',
};
/**
 * 动作类型
 */
var ActionType;
(function (ActionType) {
    /**
     * 消除
     */
    ActionType[ActionType["Elimate"] = 0] = "Elimate";
    /**
     * 生成
     */
    ActionType[ActionType["Generate"] = 1] = "Generate";
    /**
     * 掉落
     */
    ActionType[ActionType["Drop"] = 2] = "Drop";
    /**
     * 填充
     */
    ActionType[ActionType["Auto"] = 3] = "Auto";
    /**
     * 改变
     */
    ActionType[ActionType["Alter"] = 4] = "Alter";
    /**
     * 扩展
     */
    ActionType[ActionType["Stretched"] = 5] = "Stretched";
    /**
     * 重置
     */
    ActionType[ActionType["Rearrange"] = 6] = "Rearrange";
    /**
     * 开局道具
     */
    ActionType[ActionType["GameStartItem"] = 7] = "GameStartItem";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
/**
 * 方块消除类型
 */
var eElimateType;
(function (eElimateType) {
    /** 点击消除 */
    eElimateType[eElimateType["Hit"] = 0] = "Hit";
    /** 碰撞消除 */
    eElimateType[eElimateType["Crash"] = 1] = "Crash";
    /** 掉落消除 */
    eElimateType[eElimateType["Drop"] = 2] = "Drop";
    /** 不可消除 */
    eElimateType[eElimateType["CantElim"] = 3] = "CantElim";
    /** 命中消除 */
    eElimateType[eElimateType["ShootTarget"] = 4] = "ShootTarget";
    /** 特殊消除 */
    eElimateType[eElimateType["Special"] = 5] = "Special";
    /** 火箭火箭消除 */
    eElimateType[eElimateType["DoubleRocket"] = 6] = "DoubleRocket";
    /** 炸弹火箭消除 */
    eElimateType[eElimateType["BombRocket"] = 7] = "BombRocket";
    /** 炸弹炸弹消除 */
    eElimateType[eElimateType["DoubleBomb"] = 8] = "DoubleBomb";
    /** 星球火箭消除 */
    eElimateType[eElimateType["StarRocket"] = 9] = "StarRocket";
    /** 星球炸弹消除 */
    eElimateType[eElimateType["StarBomb"] = 10] = "StarBomb";
    /** 星球星球消除 */
    eElimateType[eElimateType["DoubleStar"] = 11] = "DoubleStar";
    /** 横火箭道具消除 */
    eElimateType[eElimateType["Prop_Row"] = 12] = "Prop_Row";
    /** 竖火箭道具消除 */
    eElimateType[eElimateType["Prop_vertical"] = 13] = "Prop_vertical";
    /** 步数转化消除 */
    eElimateType[eElimateType["Step2Rocket"] = 14] = "Step2Rocket";
    /** 特效消除 */
    eElimateType[eElimateType["Horse"] = 15] = "Horse";
})(eElimateType = exports.eElimateType || (exports.eElimateType = {}));
/**
 * 道具类型
 */
var PropType;
(function (PropType) {
    PropType[PropType["NONE"] = 0] = "NONE";
    PropType[PropType["HAMMER"] = 1] = "HAMMER";
    PropType[PropType["ROW"] = 2] = "ROW";
    PropType[PropType["VERTICAL"] = 3] = "VERTICAL";
    PropType[PropType["REARRANGE"] = 4] = "REARRANGE";
})(PropType = exports.PropType || (exports.PropType = {}));
/**
 * 比赛操作类型
 *
 * @export
 * @enum {number}
 */
var RaceAction;
(function (RaceAction) {
    RaceAction[RaceAction["StartGame"] = 0] = "StartGame";
    RaceAction[RaceAction["TouchBlock"] = 1] = "TouchBlock";
    RaceAction[RaceAction["UseProp"] = 2] = "UseProp";
    RaceAction[RaceAction["Leftstep2Rocket"] = 3] = "Leftstep2Rocket";
    RaceAction[RaceAction["UsePill"] = 4] = "UsePill";
})(RaceAction = exports.RaceAction || (exports.RaceAction = {}));
var gameStartItem;
(function (gameStartItem) {
    gameStartItem[gameStartItem["Rocket"] = 0] = "Rocket";
    gameStartItem[gameStartItem["Bomb"] = 1] = "Bomb";
    gameStartItem[gameStartItem["Pipe"] = 2] = "Pipe";
})(gameStartItem = exports.gameStartItem || (exports.gameStartItem = {}));
//# sourceMappingURL=GameDef.js.map