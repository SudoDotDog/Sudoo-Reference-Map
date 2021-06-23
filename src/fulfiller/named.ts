/**
 * @author WMXPY
 * @namespace ReferenceMap_Fulfiller
 * @description Named
 */

import { ReferenceMapKey } from "../declare";

export type NamedFulfillFunction<K, T> = (key: K) => T | Promise<T>;
export type NamedFulfillVerifyFunction<K> = (key: K) => boolean | Promise<boolean>;

export class NamedReferenceFulfiller<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(fulfiller: NamedFulfillFunction<K, T>): NamedReferenceFulfiller<K, T> {

        return new NamedReferenceFulfiller<K, T>(fulfiller);
    }

    private readonly _fulfiller: NamedFulfillFunction<K, T>;
    private _verifier?: NamedFulfillVerifyFunction<K>;

    private constructor(fulfiller: NamedFulfillFunction<K, T>) {

        this._fulfiller = fulfiller;
    }

    public withVerify(verifier: NamedFulfillVerifyFunction<K>): this {

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
