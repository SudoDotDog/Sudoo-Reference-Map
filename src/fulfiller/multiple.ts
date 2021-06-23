/**
 * @author WMXPY
 * @namespace ReferenceMap_Fulfiller
 * @description Multiple
 */

import { ReferenceMapKey } from "../declare";

export type MultipleFulfillFunction<T> = () => T[] | Promise<T[]>;
export type MultipleFulfillKeyExtractor<K, T> = (element: T) => K;
export type MultipleVerifyFunction = () => boolean | Promise<boolean>;

export type MultipleReferenceFulfillerResultElement<K, T> = {

    readonly key: K;
    readonly value: T;
};

export class MultipleReferenceFulfiller<K extends ReferenceMapKey = string, T extends any = any> {

    public static create<K extends ReferenceMapKey = string, T extends any = any>(fulfiller: MultipleFulfillFunction<T>, keyExtractor: MultipleFulfillKeyExtractor<K, T>): MultipleReferenceFulfiller<K, T> {

        return new MultipleReferenceFulfiller<K, T>(fulfiller, keyExtractor);
    }

    private readonly _fulfiller: MultipleFulfillFunction<T>;
    private readonly _keyExtractor: MultipleFulfillKeyExtractor<K, T>;
    private _verifier?: MultipleVerifyFunction;

    private constructor(fulfiller: MultipleFulfillFunction<T>, keyExtractor: MultipleFulfillKeyExtractor<K, T>) {

        this._fulfiller = fulfiller;
        this._keyExtractor = keyExtractor;
    }

    public withVerify(verifier: MultipleVerifyFunction): this {

        this._verifier = verifier;
        return this;
    }

    public async shouldFulfillWith(): Promise<boolean> {

        if (typeof this._verifier !== 'function') {
            return true;
        }

        const verifyResult: boolean = await Promise.resolve(this._verifier());
        return Boolean(verifyResult);
    }

    public async execute(): Promise<Array<MultipleReferenceFulfillerResultElement<K, T>>> {

        const result: T[] = await Promise.resolve(this._fulfiller());
        const mappedResult: MultipleReferenceFulfillerResultElement<K, T>[] = result.map((each: T) => {

            return {
                key: this._keyExtractor(each),
                value: each,
            };
        })
        return mappedResult;
    }
}
