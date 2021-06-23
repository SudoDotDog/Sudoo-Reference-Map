/**
 * @author WMXPY
 * @namespace ReferenceMap
 * @description Item Fulfiller
 */

import { ReferenceMapKey } from "./declare";

export type NamedFulfillItemFulfillFunction<K, T> = (key: K) => T | Promise<T>;
export type NamedFulfillItemVerifyFunction<K> = (key: K) => boolean | Promise<boolean>;

export class NamedReferenceItemFulfiller<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(fulfiller: NamedFulfillItemFulfillFunction<K, T>): NamedReferenceItemFulfiller<K, T> {

        return new NamedReferenceItemFulfiller<K, T>(fulfiller);
    }

    private readonly _fulfiller: NamedFulfillItemFulfillFunction<K, T>;
    private _verifier?: NamedFulfillItemVerifyFunction<K>;

    private constructor(fulfiller: NamedFulfillItemFulfillFunction<K, T>) {

        this._fulfiller = fulfiller;
    }

    public withVerify(verifier: NamedFulfillItemVerifyFunction<K>): this {

        this._verifier = verifier;
        return this;
    }

    public async shouldFulfillWith(key: K): Promise<boolean> {

        if (typeof this._verifier !== 'function') {
            return true;
        }

        const verifyResult: boolean = await Promise.resolve(this._verifier(key));
        return Boolean(verifyResult);
    }

    public async execute(key: K): Promise<T> {

        const result: T = await Promise.resolve(this._fulfiller(key));
        return result;
    }
}
