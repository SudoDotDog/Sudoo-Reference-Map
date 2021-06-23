/**
 * @author WMXPY
 * @namespace ReferenceMap
 * @description Map
 */

import { ReferenceMapKey } from "./declare";
import { NamedReferenceItemFulfiller } from "./item-fulfiller";

export class ReferenceMap<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(): ReferenceMap<K, T> {

        return new ReferenceMap<K, T>();
    }

    private _itemMap: Map<K, T>;

    private readonly _itemFulfillers: Array<NamedReferenceItemFulfiller<K, T>>;

    private constructor() {

        this._itemMap = new Map<K, T>();
    }
}
