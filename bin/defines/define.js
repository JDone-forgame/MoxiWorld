"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = exports.DBDefine = exports.RankType = void 0;
const mx_tool_1 = require("mx-tool");
/**
 * 榜单类型
 *
 * @export
 * @enum {number}
 */
var RankType;
(function (RankType) {
    RankType["Level"] = "R001";
})(RankType = exports.RankType || (exports.RankType = {}));
exports.DBDefine = {
    db: mx_tool_1.ConfigMgr.get('db.database') || "ClickEliminateServer",
    col_role: 'roles',
    col_mail: 'mails',
    col_task: 'tasks',
    col_achievement: 'achievement',
    col_level: 'levels',
    col_team: 'team',
    col_subscribe: 'subscribe',
};
var ErrorCode;
(function (ErrorCode) {
    /**------------------------------------通用部分--------------------------------------------------------- */
    ErrorCode[ErrorCode["ok"] = 0] = "ok";
    ErrorCode[ErrorCode["param_error"] = 1] = "param_error";
    ErrorCode[ErrorCode["appid_error"] = 2] = "appid_error";
    ErrorCode[ErrorCode["session_key_error"] = 3] = "session_key_error";
    ErrorCode[ErrorCode["db_error"] = 4] = "db_error";
    ErrorCode[ErrorCode["login_error"] = 5] = "login_error";
    // 平台 
    ErrorCode[ErrorCode["platform_connect_failed"] = 4] = "platform_connect_failed";
    ErrorCode[ErrorCode["platform_api_query_error"] = 90001] = "platform_api_query_error";
    ErrorCode[ErrorCode["platform_add_item_fail"] = 90002] = "platform_add_item_fail";
    /**------------------------------------角色部分--------------------------------------------------------- */
    ErrorCode[ErrorCode["role_no"] = 10001] = "role_no";
    ErrorCode[ErrorCode["role_exist"] = 10004] = "role_exist";
    ErrorCode[ErrorCode["role_token_error"] = 10005] = "role_token_error";
    /**------------------------------------游戏部分--------------------------------------------------------- */
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
//# sourceMappingURL=define.js.map