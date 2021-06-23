/**
 * @author WMXPY
 * @namespace ReferenceMap
 * @description Map
 */

import { ReferenceMapKey } from "./declare";
import { MultipleReferenceFulfiller, MultipleReferenceFulfillerResultElement } from "./fulfiller/multiple";
import { NamedReferenceFulfiller } from "./fulfiller/named";

export class ReferenceMap<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(): ReferenceMap<K, T> {

        return new ReferenceMap<K, T>();
    }

    private _itemMap: Map<K, T>;

    private readonly _namedFulfillers: Array<NamedReferenceFulfiller<K, T>>;

    private constructor() {

        this._itemMap = new Map<K, T>();

        this._namedFulfillers = [];
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

    public async refreshItem(key: K): Promise<boolean> {

        this.reset(key);
        return await this.fulfillItem(key);
    }

    public async batchWith(fulfiller: MultipleReferenceFulfiller<K, T>): Promise<boolean> {

        const shouldUse: boolean = await fulfiller.shouldFulfillWith();

        if (!shouldUse) {
            return false;
        }

        const result: Array<MultipleReferenceFulfillerResultElement<K, T>> = await fulfiller.execute();

        for (const each of result) {
            this._itemMap.set(each.key, each.value);
        }

        return true;
    }

    public async fulfillItem(key: K): Promise<boolean> {

        if (this._itemMap.has(key)) {
            return false;
        }

        for (const fulfiller of this._namedFulfillers) {

            const shouldUse: boolean = await fulfiller.shouldFulfillWith(key);

            if (shouldUse) {

                const value: T = await fulfiller.execute(key);
                this._itemMap.set(key, value);
                return true;
            }
        }
        return false;
    }
}
