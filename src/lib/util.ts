export function noOp(): boolean {
    return true;
}

export interface IFileManager {
    get(segments: string[]): Promise<string>;
    set(segments: string[], content: string): Promise<boolean>;
}
