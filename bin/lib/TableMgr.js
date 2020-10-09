"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableMgr = void 0;
const mx_resource_1 = require("mx-resource");
const interface_1 = require("../defines/interface");
const mx_tool_1 = require("mx-tool");
const fs_1 = require("fs");
const path_1 = require("path");
class PltFileList {
    constructor() {
        this._file_list = [];
        this._tablePath = "res/table/";
        this.readFileList();
    }
    static get_plt_file(filename, plt) {
        if (!this._inst) {
            this._inst = new PltFileList();
        }
        let channelName = mx_tool_1.ConfigMgr.get('channel');
        return this._inst.get_plt_file(filename, channelName);
    }
    readFileList() {
        try {
            var read_data = fs_1.readFileSync(path_1.join(this._tablePath, '_filelist_.json'));
            var js_data = JSON.parse(read_data.toString());
            this._file_list = js_data['_files_'] || [];
        }
        catch (e) {
        }
    }
    get_plt_file(filename, plt) {
        let pltFile = filename + '_' + plt + '.json';
        if (this._file_list.indexOf(pltFile) >= 0) {
            return path_1.join(this._tablePath, pltFile);
        }
        return path_1.join(this._tablePath, filename + ".json");
    }
}
class TableMgr {
    constructor() {
        this._gameGuideCache = {};
        this._levelMapCache = {};
    }
    static get inst() {
        if (!this._inst) {
            this._inst = new TableMgr();
        }
        return this._inst;
    }
    /**
     * 加载所有表格
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this._task = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Task"));
            this._global = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Global"));
            this._levels = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Checkpoint"));
            this._teamReward = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("TeamAward"));
            this._items = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Item"));
            this._block = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Block"));
            this._comboList = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Combinationeffect"));
            this._checkpoint = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Checkpoint"));
            this._buyItems = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("BuyItem"));
            this._randomDrop = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("RandomDrop"));
            this._achievement = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Achievement"));
            this._signin = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file("Signin"));
            this.initAllSigninList();
            return true;
        });
    }
    /**
     * 通过任务id获取任务信息
     * @param taskId
     */
    getTaskInfo(taskId) {
        return this._task.getRes(taskId);
    }
    /**
     * 获取所有的任务列表
     */
    getAllTask() {
        return this._task.getAllRes();
    }
    /**
     * 获取指定类型的任务
     * @param nType
     */
    getTaskInfoByType(nType) {
        let res = this._task.getAllRes();
        let ret = [];
        for (let taskId in res) {
            let taskInfo = res[taskId];
            if (taskInfo && taskInfo.eTaskType == nType) {
                ret.push(taskInfo);
            }
        }
        return ret;
    }
    /**
     * 获取全局配置id
     * @param sKey
     */
    getGlobalConfig(sKey) {
        let res = this._global.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.kGlobalType == sKey) {
                return configInfo.kGlobalData;
            }
        }
        return "";
    }
    /**
     * 获取关卡的配置信息
     * @param levelId
     */
    getLevelInfo(levelId) {
        let res = this._levels.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.sID == levelId) {
                return configInfo;
            }
        }
        return null;
    }
    /**
     * 获取组队奖励配置信息
     *
     * @static
     * @param {string} sId
     * @returns {SeResTeamAward}
     * @memberof TableMgr
     */
    getTeamRewardInfo(sId) {
        let res = this._teamReward.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
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
    getTeamRewardInfoByDay(day) {
        let res = this._teamReward.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.iDays == day) {
                return configInfo;
            }
        }
        return null;
    }
    getItemInfo(sId) {
        let res = this._items.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.kID == sId) {
                return configInfo;
            }
        }
        return null;
    }
    getItemInfoByType(type) {
        let res = this._items.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.eItemName == type) {
                return configInfo;
            }
        }
        return null;
    }
    getGuideReward(levelId) {
        let checkPointRes = this.getCheckPoint(levelId);
        if (!checkPointRes) {
            return [];
        }
        if (!this._gameGuideCache[levelId]) {
            this._gameGuideCache[levelId] = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file(checkPointRes.sGameguide));
        }
        if (!this._gameGuideCache[levelId]) {
            return [];
        }
        let items = [];
        let res = this._gameGuideCache[levelId].getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.eGuidetype == interface_1.SeEnumGameguideeGuidetype.YinDaoDianJiDaoJu && configInfo.akGiveitem) {
                items = items.concat(configInfo.akGiveitem);
            }
        }
        return items;
    }
    getBlockRes(sId) {
        let res = this._block.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }
    hasProperty(id, property) {
        let res = this.getBlockRes(id);
        if (res && ((res.eProperty & property) == res.eProperty)) {
            return true;
        }
        return false;
    }
    hasElminateRole(id) {
        let res = this.getBlockRes(id);
        if (res && res.eProperty)
            return true;
        else
            return false;
    }
    hasCheckedRole(id, property) {
        let res = this.getBlockRes(id);
        if (res && res.eProperty == property)
            return true;
        else
            return false;
    }
    getElimBlocks(iCount) {
        let result = [];
        let res = this._block.getOriAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && ((configInfo.eProperty & interface_1.SeEnumBlockeProperty.ChangGuiXiaoChu) == configInfo.eProperty)) {
                result.push(id);
                if (iCount && result.length >= iCount) {
                    break;
                }
            }
        }
        return result;
    }
    getBlockMD5() {
        return this._block.md5;
    }
    getComboEffect(combo1, combo2) {
        let combo = null;
        let res = this._comboList.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.iComID1 == combo1 && configInfo.iComID2 == combo2) {
                combo = configInfo.sID;
            }
        }
        return combo;
    }
    getCheckPoint(sId) {
        let res = this._checkpoint.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }
    getCheckPointMD5() {
        return this._checkpoint.md5;
    }
    getlevelMap(levelId) {
        let levelInfo = this.getCheckPoint(levelId);
        if (!levelInfo) {
            return null;
        }
        if (!this._levelMapCache[levelId]) {
            this._levelMapCache[levelId] = mx_resource_1.ResourceModule.watch(PltFileList.get_plt_file(`Levels/${levelInfo.sFileName}`));
        }
        return this._levelMapCache[levelId].getOriAllRes();
    }
    getBuyItemResBySid(sId) {
        let res = this._buyItems.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            if (configInfo && configInfo.sID == sId) {
                return configInfo;
            }
        }
        return null;
    }
    getAllRandomDropRes() {
        let res = this._randomDrop.getAllRes();
        return res;
    }
    /**
     * 通过成就id获取成就资源
     * @param taskId
     */
    getAchievementResById(acId) {
        return this._achievement.getRes(acId);
    }
    /**
     * 获取所有的成就列表
     */
    getAllAchievementRes() {
        return this._achievement.getAllRes();
    }
    /**
     * 获取指定类型的成就信息
     * @param type
     */
    getAchievementResByType(type) {
        let res = this._achievement.getAllRes();
        let ret = [];
        for (let acId in res) {
            let acRes = res[acId];
            if (acRes && acRes.eAchType == type) {
                ret.push(acRes);
            }
        }
        return ret;
    }
    /**
     * 获取指定前置条件的成就信息
     */
    getAchievementResByPrecondition(precondition, param) {
        let res = this._achievement.getAllRes();
        let ret = [];
        for (let acId in res) {
            let acRes = res[acId];
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
    getAchievementStageCondition(acRes, stage) {
        let condValue = -1;
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
    getAchievementAwardItems(acRes, stage) {
        let awardItems = [];
        if (stage >= acRes.asAward.length) {
            return awardItems;
        }
        let awardString = acRes.asAward[stage];
        awardItems = awardString.split(";");
        return awardItems;
    }
    /**
     * 检查当前成就是否存在前置条件
     * @param acRes
     */
    HasAchievementResPrecondition(acRes) {
        if (acRes.ePreconditions === interface_1.SeEnumAchievementePreconditions.WuQianZhiTiaoJian) {
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * 将签到奖励配置保存到列表中
     */
    initAllSigninList() {
        this._signinList = [];
        let res = this._signin.getAllRes();
        for (let id in res) {
            let configInfo = res[id];
            this._signinList.push(configInfo);
        }
    }
    /**
     * 获取新一轮的签到奖励ID
     * @param oldAwardID
     */
    genNewSigninAwardID(oldAwardID) {
        let newAwardID = "";
        if (this._signinList.length <= 0) {
            return newAwardID;
        }
        let curAwardIndex = -1;
        for (let i = 0; i < this._signinList.length; ++i) {
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
    getSigninRes(sid) {
        let res = this._signin.getAllRes();
        for (let id in res) {
            let config = res[id];
            if (config && config.sID == sid) {
                return config;
            }
        }
        return null;
    }
}
exports.TableMgr = TableMgr;
//# sourceMappingURL=TableMgr.js.map