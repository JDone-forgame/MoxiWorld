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
const fs_1 = require("fs");
const mx_tool_1 = require("mx-tool");
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
        this.name = "TableMgr";
    }
    static get inst() {
        if (!this._inst) {
            this._inst = new TableMgr();
        }
        return this._inst;
    }
    /**-------------------------------------------------加载所有表格--------------------------------------------------------------- */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // 加载倒计时表
            return true;
        });
    }
}
exports.TableMgr = TableMgr;
//# sourceMappingURL=TableMgr.js.map