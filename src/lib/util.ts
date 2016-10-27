export function noOp(): boolean {
    return true;
}

export interface IFileManager {
    get(segments: string[]): Promise<Object>;
    set(segments: string[], content: Object): Promise<boolean>;
}
