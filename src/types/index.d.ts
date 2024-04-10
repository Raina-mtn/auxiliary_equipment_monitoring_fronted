declare interface Fn<T = any, R = T> {
    (...arg: T[]): R;
}

declare interface PromiseFn<T = any, R = T> {
    (...arg: T[]): Promise<R>;
}

declare type Recordable<T = any> = Record<string, T>
declare type EmitType = (event: string, ...args: any[]) => void
declare type Nullable<T> = T | null