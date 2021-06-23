/**
 * @author WMXPY
 * @namespace ReferenceMap
 * @description Map
 */

import { ReferenceMapKey } from "./declare";
import { NamedReferenceFulfiller } from "./fulfiller/named";

export class ReferenceMap<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(): ReferenceMap<K, T> {

        return new ReferenceMap<K, T>();
    }

    private _itemMap: Map<K, T>;

    private readonly _namedFulfillers: Array<NamedReferenceFulfiller<K, T>>;

    private constructor() {

        this._itemMap = new Map<K, T>();
    }

    public fulfillItemWith(fulfiller: NamedReferenceFulfiller<K, T>): this {

        this._namedFulfillers.push(fulfiller);
        return this;
    }

    public ensureItemOrDefault(key: K, defaultItem: T): T {

        if (!this._itemMap.has(key)) {
            return defaultItem;
        }
        return this._itemMap.get(key) as T;
    }

    public ensureItemOrUndefined(key: K): T | undefined {

        if (!this._itemMap.has(key)) {
            return undefined;
        }
        return this._itemMap.get(key) as T;
    }

    public ensureItemOrNull(key: K): T | null {

        if (!this._itemMap.has(key)) {
            return null;
        }
        return this._itemMap.get(key) as T;
    }

    public reset(key: K): this {

        this._itemMap.delete(key);
        return this;
    }

    public async getItemOrDefault(key: K, defaultItem: T): Promise<T> {

        await this.fulfillItem(key);
        if (!this._itemMap.has(key)) {
            return defaultItem;
        }
        return this._itemMap.get(key) as T;
    }

    public async getItemOrUndefined(key: K): Promise<T | undefined> {

        await this.fulfillItem(key);
        if (!this._itemMap.has(key)) {
            return undefined;
        }
        return this._itemMap.get(key) as T;
    }

    public async getItemOrNull(key: K): Promise<T | null> {

        await this.fulfillItem(key);
        if (!this._itemMap.has(key)) {
            return null;
        }
        return this._itemMap.get(key) as T;
    }

    public async refreshItem(key: K): Promise<void> {

        this.reset(key);
        await this.fulfillItem(key);
        return;
    }

    public async fulfillItem(key: K): Promise<void> {

        if (this._itemMap.has(key)) {
            return;
        }

        fulfillers: for (const fulfiller of this._namedFulfillers) {

            const shouldUse: boolean = await fulfiller.shouldFulfillWith(key);

            if (shouldUse) {

                const value: T = await fulfiller.execute(key);
                this._itemMap.set(key, value);
                break fulfillers;
            }
        }
        return;
    }
}
