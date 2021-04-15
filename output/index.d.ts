export interface TsParserOption {
    /** 作用域 */
    context?: string;
    /** ts 文件路径 */
    file: string;
}
declare type TsParserResult<T = any> = [Error | undefined, T?];
export declare function tsParser<T = any>(op: TsParserOption): TsParserResult<T>;
export {};
