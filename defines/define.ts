import { ConfigMgr } from "mx-tool";
/**
 * 榜单类型
 *
 * @export
 * @enum {number}
 */
export enum RankType {
    Level = "R001",
}


export var DBDefine = {
    db: ConfigMgr.get('db.database') || "ClickEliminateServer",
    col_role: 'roles',
    col_mail: 'mails',
    col_task: 'tasks',
    col_achievement: 'achievement',
    col_level: 'levels',
    col_team: 'team',
    col_subscribe: 'subscribe',
}

export enum ErrorCode {
    /**------------------------------------通用部分--------------------------------------------------------- */
    ok = 0,
    param_error = 1,
    appid_error = 2,
    session_key_error = 3,
    db_error = 4,
    login_error = 5,

    // 平台 
    platform_connect_failed = 4,
    platform_api_query_error = 90001,
    platform_add_item_fail = 90002,
    
    /**------------------------------------角色部分--------------------------------------------------------- */
    role_no = 10001,
    role_exist = 10004,
    role_token_error = 10005,
    
    /**------------------------------------游戏部分--------------------------------------------------------- */
    
}
