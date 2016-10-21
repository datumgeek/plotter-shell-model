import { Pak } from './pak';

export class View {
    public static fromJSON(json: ViewJSON): View {
        let view = new View();
        view.locked = json.locked;
        view.uniqueId = json.uniqueId;
        view.pane = json.pane;
        view.moduleUrl = json.moduleUrl;
        view.baseUriName = json.baseUriName;
        return view;
    }

    public locked: boolean;
    public uniqueId: string;
    public pane: PaneType;
    public moduleUrl: string;
    public baseUriName: string;
    public pak: Pak;
}

export type PaneType = 'nav' | 'main' | 'alt';

export interface ViewJSON {
    locked: boolean;
    uniqueId: string;
    pane: PaneType;
    moduleUrl: string;
    baseUriName: string;
}
