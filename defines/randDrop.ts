import { SeResRandomDrop } from "./interface"

export interface DropItem {
    itemId: string;
    count: number;
}

export interface RandDropInfo { 
    dropItems: Array<DropItem>;
    weight: number;
}

export interface RandBox {
    totalWeight: number;
    dropInfos: Array<RandDropInfo>;
}