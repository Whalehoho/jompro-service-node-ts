import { DebouncedFunc } from 'lodash';

export interface MemoizeDebounce<T extends (...args: any) => any> extends DebouncedFunc<T> {
    (...args: Parameters<T>): ReturnType<T> | undefined;
    flush: (...args: Parameters<T>) => ReturnType<T> | undefined;
    cancel: (...args: Parameters<T>) => void;
}
