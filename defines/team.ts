
export interface iTeamMemberInfo {
    teamId: string,
    gameId: string,
    nickname: string,
    avatar: string,
    level : number,
    isLocked : boolean,
    joinTime : number,
}

export interface iTeamInfo{
    teamId : string;
    leaderId : string;
    members : Array<iTeamMemberInfo>;
    rewarded : Array<number>;
}