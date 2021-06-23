/**
 * @author WMXPY
 * @namespace ReferenceMap
 * @description Map
 */

import { ReferenceMapKey } from "./declare";

export class ReferenceMap<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(): ReferenceMap<K, T> {

        return new ReferenceMap<K, T>();
    }

    private constructor() {

    }
}
