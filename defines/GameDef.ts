

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { TeMap } from "mx-tool"

/**
  * 一些单局元素定义
  */
 export enum BlockType {
  Null = 'A000',

  Red = 'A001',
  Blue = 'A002',
  Yellow = 'A003',
  Green = 'A004',
  Purple = 'A005',
  Orange = 'A006',

  Bomb = 'A007',
  BigBomb = 'A008',
  RowRocket = 'A009',
  ColRocket = 'A010',

  All_Red = 'A011',
  All_Blue = 'A012',
  All_Yellow = 'A013',
  All_Green = 'A014',
  All_Purple = 'A015',
  All_Orange = 'A016',

  Bubble = 'B001',

  Terrain = 'C001',

  Empty = 'C002',

  MuTong_1 = 'A018',
  MuTong_2 = 'A019',
  MuTong_3 = 'A020',

  MuXiang_1 = 'A030',
  Muxiang_2 = 'A031',
  Muxiang_3 = 'A032',


  DoubleRocket = 'D001',
  BombRocket = 'D002',
  DoubleBomb = 'D003',
  StarRocket = 'D004',
  StarBomb = 'D005',
  DoubleStar = 'D006',

  IceWithRed2 = 'A025',
  IceWithRed1 = 'A024',

  Ball = 'A017',

  BigBall_upLeft = 'A026',
  BigBall_upRight = 'A027',
  BigBall_downLeft = 'A028',
  BigBall_downRight = 'A029',

  IceWithBall1 = 'A033',
  IceWithBomb1 = 'A034',
  IceWithRocketRow1 = 'A035',
  IceWithRocketCol1 = 'A036',
  IceWithCask11 = 'A037',
  IceWithCask21 = 'A038',
  IceWithCask31 = 'A039',
  IceWithYellow1 = 'A040',
  IceWithBlue1 = 'A041',
  IceWithHorse = 'A044',

  BlockPoison = 'A045',

  ChiChen = 'A023',

  BlockDiglett1 = 'A047',
  BlockDiglett2 = 'A048',

  BlockTurtle = 'A049',

  BlcokWatermelonBig = 'A052',
  BlockWatermelonSmall = 'A051',
  BlockIceWatermelon = 'A053',
}

export enum ActionTag {
  Block_ClickError,
  Block_Falling,
  Block_Compound,
}

export enum ResourceType {
  //值和blockType错开
  NULL = 10000,

  Grid = 10001,
}

export const GameConst = {
  //逻辑
  MaxRow: 9,
  MaxCol: 9,
  MaxColorCount: 6,

  //显示
  BlockDropSpeed: 15,  //方块一秒钟掉几格速度 
  BlockAutoFillSpeed: 18,
  GridSize: 70,      //消除块的大小
  DropDelRow: 6,     //从上面掉下来的block离目标多少格
}

export const LevelParam = {
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
}


/**
 * 动作类型
 */
export enum ActionType {
  /**
   * 消除
   */
  Elimate,

  /**
   * 生成
   */
  Generate,

  /**
   * 掉落
   */
  Drop,

  /**
   * 填充
   */
  Auto,

  /**
   * 改变
   */
  Alter,

  /**
   * 扩展
   */
  Stretched,

  /**
   * 重置
   */
  Rearrange,

  /**
   * 开局道具
   */
  GameStartItem,
}

/**
 * 方块消除类型
 */
export enum eElimateType {
  /** 点击消除 */
  Hit,
  /** 碰撞消除 */
  Crash,
  /** 掉落消除 */
  Drop,
  /** 不可消除 */
  CantElim,
  /** 命中消除 */
  ShootTarget,
  /** 特殊消除 */
  Special,
  /** 火箭火箭消除 */
  DoubleRocket,
  /** 炸弹火箭消除 */
  BombRocket,
  /** 炸弹炸弹消除 */
  DoubleBomb,
  /** 星球火箭消除 */
  StarRocket,
  /** 星球炸弹消除 */
  StarBomb,
  /** 星球星球消除 */
  DoubleStar,
  /** 横火箭道具消除 */
  Prop_Row,
  /** 竖火箭道具消除 */
  Prop_vertical,
  /** 步数转化消除 */
  Step2Rocket,
  /** 特效消除 */
  Horse,
}

/**
 * 道具类型
 */
export enum PropType {
  NONE,
  HAMMER,
  ROW,
  VERTICAL,
  REARRANGE,
}




/**
 * 操作信息
 */
export interface iAciontInfo {
  /** 动作类型 */
  actionType: ActionType;
  /** 存储消除方块和消除类型 */
  elimateBlocks?: Map<eElimateType, Array<number>>;
  /** 点击的方块位置 */
  index?: number;
  /** 本次动作生成的方块和位置 */
  generateBlocks?: Map<number, string>;
  /** 掉落方块  */
  dropBlocks?: TeMap<number>;
  /** 填充动作  */
  autoBlocks?: TeMap<string>;
  /** 星球火箭组合，或者步数转火箭，要存储生成的火箭类型和位置 */
  triggeredIdxs?: TeMap<BlockType>;
  /** 特殊方块组合，这里存储哪几块特殊方块连接在一起  */
  pointBlock?: Array<number>;
  /** 特殊方块的组合效果中存储权重最大的方块index */
  specialComboIndex?: number;
  /** 重置方块位置，存储旧位置和新位置的index */
  changeMap?: TeMap<number>;
  /** 完全卡死判断 */
  isCurrentSticked?: boolean;
  /** 发生变化的方块字典 */
  blockTurnedMap?: TeMap<string>;
  /** 被扩展的方块位置 */
  blockStretched?: TeMap<Array<number>>;
  /** 西瓜无法延展的数量 */
  hasWatherMaelonCut?: number;
  /** 被消除的大西瓜的位置 */
  watermelonPos?: Array<number>;
  /** 开局道具设置 */
  gameStartItems?: TeMap<number>;
}

/**
* 一次消除操作的返回结果
*/
export interface iElminateResult {
  /** 点击的位置 */
  triggerIndex: number;
  /** 本次点击产生的所有动作 */
  actions: Array<iAciontInfo>;
  /** 本次点击所有消除的方块 */
  eliminated: Array<string>;
  /** 使用道具情况 */
  usePropType: PropType;
  /** 是否是步数转化 */
  isStep2Rocket?: boolean;
  /** 是否是开局道具设置 */
  isGameStartItem?: boolean;
}



/**
 * 比赛操作类型
 *
 * @export
 * @enum {number}
 */
export enum RaceAction {
  StartGame,
  TouchBlock,
  UseProp,
  Leftstep2Rocket,
  UsePill,
}

/**
* 比赛操作信息
*
* @export
* @interface RaceActionInfo
*/
export interface RaceActionInfo {
  type: RaceAction;
  data: any;
  checkInfo: string;
}

export interface validateRaceInfo{
  levelId : string;
  levelMD5 : string;
  checkPointMD5 : string;
  blockMD5 : string;
  actions : Array<RaceActionInfo>;
}



export interface iGameResult{
  isSucess : boolean;
  score : number;
}

export enum gameStartItem {
  Rocket,
  Bomb,
  Pipe,
}
