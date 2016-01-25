export default class Injector {
    private static registery;
    static getRegistered(key: string): any;
    static register(key: string, value: any): void;
}
export declare function inject(...keys: string[]): (...args: any[]) => any;
