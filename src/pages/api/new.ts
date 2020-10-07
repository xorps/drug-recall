import { NextApiRequest, NextApiResponse } from 'next';
import * as db from '../../zapatos/src';
import * as s from '../../zapatos/schema';
// import pool from '../../pgPool';
import NewRecall from '../../types/NewRecall';
import Store from '../../types/Store';

type ValidationSuccess = {
    success: true;
    value: NewRecall;
};

type ValidationFailure = {
    success: false;
    errors: Partial<Record<keyof NewRecall, string>>;
};

function isString(value: unknown): value is string {
    return typeof value === "string";
}

function nonEmptyString(value: unknown): boolean {
    return isString(value) && value.length > 0;
}

function YesNo(value: unknown): [boolean, string] {
    const map: Record<"Yes" | "No", boolean> = { Yes: true, No: true };
    return [isString(value) && value in map, "invalid"];
}

function ValidDate(value: unknown): [boolean, string] {
    const invalidString = "invalid format. expects (mm/dd/yyyy)";
    if (isString(value)) {
        if (value.length < 0) return [false, "required"];
        try {
            const options = {year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Los_Angeles'};
            const dated = new Intl.DateTimeFormat('en-US', options).format(new Date(value));
            return [dated === value, invalidString];
        } catch {
            return [false, invalidString];
        }
    } else {
        return [false, invalidString];
    }
}

type ErrMsg = string;
type Validator = (value: unknown) => [boolean, ErrMsg];

const Required: Validator = (value) => [nonEmptyString(value), "required"];

const Schema: Record<keyof NewRecall, Validator> = {
    date: ValidDate,
    drug: Required,
    mfgr: Required,
    lot: Required,
    stocked: YesNo,
    affected: YesNo,
    date_removed: ValidDate,
    initials: Required,
};

function hasProperty<K extends string | symbol>(obj: unknown, key: K): obj is Record<K, unknown> {
    return obj instanceof Object && key in obj;
}

type ValidationResult = ValidationSuccess | ValidationFailure;

function validate_prop<K extends keyof NewRecall>(obj: unknown, prop: K, errors: Partial<Record<keyof NewRecall, string>>) {
    const value = hasProperty(obj, prop) ? obj[prop] : undefined;
    const [isValid, errMsg] = Schema[prop](value);
    if (isValid) return;
    errors[prop] = errMsg;
}

class EmptyChain {
    constructor() {}
    add<U extends string | symbol>(tag: U): Chain<U, Record<U, unknown>> {
        return new Chain([tag]);
    }
}

class Chain<T, R> {
    tags: Array<T>
    constructor(tags: Array<T>) {
        this.tags = tags;
    }
    add<U extends string | symbol>(tag: U): Chain<T | U, R & Record<U, unknown>> {
        return new Chain([...this.tags, tag]);
    }
    unwrap_T(): T { return {} as T; }
    unwrap_R(): R { return {} as R; }
    type_check<U extends R>() { return undefined; }
}

function validate(form: unknown): ValidationResult {
    const errors: Partial<Record<keyof NewRecall, string>> = {};
    const chain: Chain<keyof NewRecall, Record<keyof NewRecall, unknown>> = new EmptyChain()
        .add("date").add("drug").add("mfgr").add("lot").add("stocked").add("affected").add("date_removed").add("initials");
    chain.tags.forEach(prop => validate_prop(form, prop, errors));
    if (Object.entries(errors).length === 0) return {success: true, value: form as NewRecall};
    else return {success: false, errors};
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    if (req.method === 'POST') {
        const form = req.body;
        const result = validate(form);
        if (result.success) {
            const newRecall = result.value;
            // const db_result = await db.insert("recall", newRecall).run(pool);
            Store.push(newRecall);
            res.statusCode = 200;
            res.json({success: true});
        } else {
            res.json({success: false, errors: result.errors});
        }
    }
}