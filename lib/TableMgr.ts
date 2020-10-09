
import { ResourceModule } from "mx-resource";

import { SeResTask, SeEnumTaskeTaskType, SeResGlobal, SeResCheckpoint, SeResTeamAward, SeResItem, SeResGameguide, SeEnumGameguideeGuidetype, SeResBlock, SeEnumBlockeProperty, SeResCombinationeffect, SeEnumItemeItemName, SeResBuyItem, SeResRandomDrop, SeResAchievement, SeEnumAchievementeAchType, SeEnumAchievementePreconditions, SeResSignin } from "../defines/interface";
import { ConfigMgr } from "mx-tool";
import { readFileSync } from "fs";
import { join } from "path";

class PltFileList {
    private _file_list: string[] = [];
    private _tablePath : string = "res/table/";
    static _inst: PltFileList;

    public static get_plt_file(filename: string, plt?: string) {
        if (!this._inst) {
            this._inst = new PltFileList();
        }
        let channelName : string =  ConfigMgr.get('channel');
        return this._inst.get_plt_file(filename, channelName);
    }

    constructor() {
        this.readFileList();
    }

    private readFileList() {
        try {
            var read_data = readFileSync(join(this._tablePath, '_filelist_.json'));
            var js_data = JSON.parse(read_data.toString());
            this._file_list = js_data['_files_'] || [];
        }
        catch (e) {

        }
    }

    private get_plt_file(filename: string, plt : string) : string{
        let pltFile : string = filename + '_' + plt + '.json';
        if (this._file_list.indexOf(pltFile) >= 0) {
            return join(this._tablePath, pltFile);
        }
        return join(this._tablePath, filename + ".json");
    }
}

export class TableMgr {

    private static _inst: TableMgr;
    public static get inst(): TableMgr {
        if (!this._inst) {
            this._inst = new TableMgr();
        }
        return this._inst;
    }

    private constructor() {

    }


    /**
     * 加载所有表格
     */
    public async init() {
        this._task = ResourceModule.watch<SeResTask>(PltFileList.get_plt_file("Task"));
        this._global = ResourceModule.watch<SeResGlobal>(PltFileList.get_plt_file("Global"));
        this._levels = ResourceModule.watch<SeResCheckpoint>(PltFileList.get_plt_file("Checkpoint"));
        this._teamReward = ResourceModule.watch<SeResTeamAward>(PltFileList.get_plt_file("TeamAward"));
        this._items = ResourceModule.watch<SeResItem>(PltFileList.get_plt_file("Item"));
        this._block = ResourceModule.watch<SeResBlock>(PltFileList.get_plt_file("Block"));
        this._comboList = ResourceModule.watch<SeResCombinationeffect>(PltFileList.get_plt_file("Combinationeffect"));
        this._checkpoint = ResourceModule.watch<SeResCheckpoint>(PltFileList.get_plt_file("Checkpoint"));
        this._buyItems = ResourceModule.watch<SeResBuyItem>(PltFileList.get_plt_file("BuyItem"));
        this._randomDrop = ResourceModule.watch<SeResRandomDrop>(PltFileList.get_plt_file("RandomDrop"));
        this._achievement = ResourceModule.watch<SeResAchievement>(PltFileList.get_plt_file("Achievement"));
        this._signin = ResourceModule.watch<SeResSignin>(PltFileList.get_plt_file("Signin"));

        this.initAllSigninList();
        return true;
    }

    /**
     * 任务
     */
    private _task: ResourceModule<SeResTask>;


    /**
     * 通过任务id获取任务信息
     * @param taskId 
     */
    public getTaskInfo(taskId: string): SeResTask {
        return this._task.getRes(taskId) as SeResTask;
    }

    /**
     * 获取所有的任务列表
     */
    public getAllTask(): { [key: string]: SeResTask } {
        return this._task.getAllRes();
    }

    /**
     * 获取指定类型的任务
     * @param nType 
     */
    public getTaskInfoByType(nType: SeEnumTaskeTaskType): SeResTask[] {
        let res: { [tkey: string]: SeResTask } = this._task.getAllRes();
        let ret: SeResTask[] = []
        for (let taskId in res) {
            let taskInfo: SeResTask | undefined = res[taskId];
            if (taskInfo && taskInfo.eTaskType == nType) {
                ret.push(taskInfo);
            }
        }

        return ret;
    }

    /**
     * 全局杂项配置
     */
    private _global: ResourceModule<SeResGlobal>;

    /**
     * 获取全局配置id
     * @param sKey 
     */
    public getGlobalConfig(sKey: string): string {
        let res: { [tkey: string]: SeResGlobal } = this._global.getAllRes();
        for (let id in res) {
            let configInfo: SeResGlobal = res[id];
            if (configInfo && configInfo.kGlobalType == sKey) {
                return configInfo.kGlobalData;
            }
        }
        return "";
    }

    /**
     * 关卡数据
     */
    private _levels: ResourceModule<SeResCheckpoint>;

    /**
     * 获取关卡的配置信息
     * @param levelId 
     */
    public getLevelInfo(levelId: string): SeResCheckpoint {
        let res: { [tkey: string]: SeResCheckpoint } = this._levels.getAllRes();
        for (let id in res) {
            let configInfo: SeResCheckpoint = res[id];
            if (configInfo && configInfo.sID == levelId) {
                return configInfo;
            }
        }
        return null;
    }

    /**
     * 组队奖励
     *
     * @private
     * @static
     * @type {ResourceModule<SeResTeamAward>}
     * @memberof TableMgr
     */
    private _teamReward: ResourceModule<SeResTeamAward>;

    /**
     * 获取组队奖励配置信息
     *
     * @static
     * @param {string} sId
     * @returns {SeResTeamAward}
     * @memberof TableMgr
     */
    public getTeamRewardInfo(sId: string): SeResTeamAward {
        let res: { [tkey: string]: SeResTeamAward } = this._teamReward.getAllRes();
        for (let id in res) {
            let configInfo: SeResTeamAward = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }


    /**
     * 根据持续天数获取组队奖励配置信息
     *
     * @static
     * @param {number} day
     * @returns {SeResTeamAward}
     * @memberof TableMgr
     */
    public getTeamRewardInfoByDay(day: number): SeResTeamAward {

        let res: { [tkey: string]: SeResTeamAward } = this._teamReward.getAllRes();
        for (let id in res) {
            let configInfo: SeResTeamAward = res[id];
            if (configInfo && configInfo.iDays == day) {
                return configInfo;
            }
        }
        return null;

    }


    /**
     * 物品信息
     *
     * @private
     * @static
     * @type {ResourceModule<SeResItem>}
     * @memberof TableMgr
     */
    private _items: ResourceModule<SeResItem>;



    public getItemInfo(sId: string): SeResItem {
        let res: { [tkey: string]: SeResItem } = this._items.getAllRes();
        for (let id in res) {
            let configInfo: SeResItem = res[id];
            if (configInfo && configInfo.kID == sId) {
                return configInfo;
            }
        }
        return null;
    }

    public getItemInfoByType(type: SeEnumItemeItemName): SeResItem {
        let res: { [tkey: string]: SeResItem } = this._items.getAllRes();
        for (let id in res) {
            let configInfo: SeResItem = res[id];
            if (configInfo && configInfo.eItemName == type) {
                return configInfo;
            }
        }
        return null;
    }


    private _gameGuideCache: { [key: string]: ResourceModule<SeResGameguide> } = {};

    public getGuideReward(levelId: string): Array<string> {
        let checkPointRes = this.getCheckPoint(levelId);
        if (!checkPointRes) {
            return [];
        }

        if (!this._gameGuideCache[levelId]) {
            this._gameGuideCache[levelId] = ResourceModule.watch<SeResGameguide>(PltFileList.get_plt_file(checkPointRes.sGameguide));
        }

        if (!this._gameGuideCache[levelId]) {
            return [];
        }

        let items: Array<string> = [];
        let res: { [tkey: string]: SeResGameguide } = this._gameGuideCache[levelId].getAllRes();
        for (let id in res) {
            let configInfo: SeResGameguide = res[id];
            if (configInfo && configInfo.eGuidetype == SeEnumGameguideeGuidetype.YinDaoDianJiDaoJu && configInfo.akGiveitem) {
                items = items.concat(configInfo.akGiveitem);
            }
        }
        return items;
    }

    // ==============> block 
    private _block: ResourceModule<SeResBlock>;

    public getBlockRes(sId: string): SeResBlock {
        let res: { [tkey: string]: SeResBlock } = this._block.getAllRes();
        for (let id in res) {
            let configInfo: SeResBlock = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }

    public hasProperty(id: string, property: SeEnumBlockeProperty): boolean {
        let res = this.getBlockRes(id);
        if (res && ((res.eProperty & property) == res.eProperty)) {
            return true;
        }

        return false;
    }

    public hasElminateRole(id: string): boolean {
        let res = this.getBlockRes(id);
        if (res && res.eProperty)
            return true;
        else
            return false;
    }

    public hasCheckedRole(id: string, property: SeEnumBlockeProperty): boolean {
        let res = this.getBlockRes(id);
        if (res && res.eProperty == property)
            return true;
        else
            return false;
    }

    public getElimBlocks(iCount?: number): string[] {
        let result: string[] = [];
        let res: { [tkey: string]: SeResBlock } = this._block.getOriAllRes();
        for (let id in res) {
            let configInfo: SeResBlock = res[id];
            if (configInfo && ((configInfo.eProperty & SeEnumBlockeProperty.ChangGuiXiaoChu) == configInfo.eProperty)) {
                result.push(id);
                if (iCount && result.length >= iCount) {
                    break;
                }
            }
        }

        return result;
    }

    public getBlockMD5(): string {
        return this._block.md5
    }

    // ==============> block  end


    private _comboList: ResourceModule<SeResCombinationeffect>;


    public getComboEffect(combo1: number, combo2: number): string {

        let combo: string = null;

        let res: { [tkey: string]: SeResCombinationeffect } = this._comboList.getAllRes();
        for (let id in res) {
            let configInfo: SeResCombinationeffect = res[id];
            if (configInfo && configInfo.iComID1 == combo1 && configInfo.iComID2 == combo2) {
                combo = configInfo.sID;
            }
        }

        return combo;
    }


    private _checkpoint: ResourceModule<SeResCheckpoint>;

    public getCheckPoint(sId: string): SeResCheckpoint {
        let res: { [tkey: string]: SeResCheckpoint } = this._checkpoint.getAllRes();
        for (let id in res) {
            let configInfo: SeResCheckpoint = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }

    public getCheckPointMD5(): string {
        return this._checkpoint.md5
    }

    private _levelMapCache: { [key: string]: ResourceModule<any> } = {};


    public getlevelMap(levelId: string): any {
        let levelInfo: SeResCheckpoint = this.getCheckPoint(levelId);
        if (!levelInfo) {
            return null;
        }

        if (!this._levelMapCache[levelId]) {
            this._levelMapCache[levelId] = ResourceModule.watch<any>(PltFileList.get_plt_file(`Levels/${levelInfo.sFileName}`));
        }
        return this._levelMapCache[levelId].getOriAllRes();
    }

    /**
     * 物品信息
     *
     * @private
     * @static
     * @type {ResourceModule<SeResBuyItem>}
     * @memberof TableMgr
     */
    private _buyItems: ResourceModule<SeResBuyItem>;

    public getBuyItemResBySid(sId: string): SeResBuyItem {
        let res: { [tkey: string]: SeResBuyItem } = this._buyItems.getAllRes();
        for (let id in res) {
            let configInfo: SeResBuyItem = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }

    /**
     * 随机掉落表
     *
     * @private
     * @static
     * @type {ResourceModule<SeResRandomDrop>}
     * @memberof TableMgr
     */
    private _randomDrop: ResourceModule<SeResRandomDrop>;

    public getAllRandomDropRes(): { [tkey: string]: SeResRandomDrop } {
        let res: { [tkey: string]: SeResRandomDrop } = this._randomDrop.getAllRes();
        return res;
    }

    /**
     * 成就
     */
    private _achievement: ResourceModule<SeResAchievement>;


    /**
     * 通过成就id获取成就资源
     * @param taskId 
     */
    public getAchievementResById(acId: string): SeResAchievement {
        return this._achievement.getRes(acId) as SeResAchievement;
    }

    /**
     * 获取所有的成就列表
     */
    public getAllAchievementRes(): { [key: string]: SeResAchievement } {
        return this._achievement.getAllRes();
    }

    /**
     * 获取指定类型的成就信息
     * @param type 
     */
    public getAchievementResByType(type: SeEnumAchievementeAchType): SeResAchievement[] {
        let res: { [tkey: string]: SeResAchievement } = this._achievement.getAllRes();
        let ret: SeResAchievement[] = []
        for (let acId in res) {
            let acRes: SeResAchievement | undefined = res[acId];
            if (acRes && acRes.eAchType == type) {
                ret.push(acRes);
            }
        }

        return ret;
    }

    /**
     * 获取指定前置条件的成就信息
     */
    public getAchievementResByPrecondition(precondition: SeEnumAchievementePreconditions, param: string): SeResAchievement[] {
        let res: { [tkey: string]: SeResAchievement } = this._achievement.getAllRes();
        let ret: SeResAchievement[] = []
        for (let acId in res) {
            let acRes: SeResAchievement | undefined = res[acId];
            if (acRes && acRes.ePreconditions == precondition && acRes.sParameter === param) {
                ret.push(acRes);
            }
        }

        return ret;
    }

    /**
     * 得到完成指定阶段成就的条件值
     * @param acRes 
     * @param stage 
     */
    public getAchievementStageCondition(acRes: SeResAchievement, stage: number) {
        let condValue: number = -1;
        if (stage >= acRes.aiCondition.length) {
            return condValue;
        }

        condValue = acRes.aiCondition[stage];
        return condValue;
    }

    /**
     * 获取指定成就阶段奖励物品列表
     * @param acRes
     * @param stage 
     */
    public getAchievementAwardItems(acRes: SeResAchievement, stage: number) {
        let awardItems: string[] = [];
        if (stage >= acRes.asAward.length) {
            return awardItems;
        }

        let awardString: string = acRes.asAward[stage];
        awardItems = awardString.split(";");

        return awardItems;
    }

    /**
     * 检查当前成就是否存在前置条件
     * @param acRes 
     */
    public HasAchievementResPrecondition(acRes: SeResAchievement): boolean {
        if (acRes.ePreconditions === SeEnumAchievementePreconditions.WuQianZhiTiaoJian) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * 签到
     */
    private _signin: ResourceModule<SeResSignin>;
    private _signinList: Array<SeResSignin>;

    /**
     * 将签到奖励配置保存到列表中
     */
    private initAllSigninList() {
        this._signinList = [];
        let res: { [tkey: string]: SeResSignin } = this._signin.getAllRes();
        for (let id in res) {
            let configInfo: SeResSignin = res[id];
            this._signinList.push(configInfo);
        }
    }

    /**
     * 获取新一轮的签到奖励ID
     * @param oldAwardID 
     */
    public genNewSigninAwardID(oldAwardID: string) {
        let newAwardID: string = "";
        if (this._signinList.length <= 0) {
            return newAwardID;
        }

        let curAwardIndex: number = -1;
        for (let i = 0; i< this._signinList.length; ++i) {
            let config = this._signinList[i];
            if (config.sID === oldAwardID) {
                curAwardIndex = i;
                break;
            }
        }

        let newAwardIndex = curAwardIndex + 1;
        if (newAwardIndex < 0 || newAwardIndex >= this._signinList.length) {
            newAwardIndex = 0;
        }

        return this._signinList[newAwardIndex].sID;
    }

    /**
     * 获取指定id签到配置
     * @param sid 
     */
    public getSigninRes(sid: string): SeResSignin {
        let res: {[key: string]: SeResSignin} = this._signin.getAllRes();
        for (let id in res) {
            let config: SeResSignin = res[id];
            if (config && config.sID == sid) {
                return config;
            }
        }
        return null;
    }
}