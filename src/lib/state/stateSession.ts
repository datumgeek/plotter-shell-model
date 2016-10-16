import { ActivePak, ActivePakJSON } from './activePak';
import { StateRepository } from './stateRepository';

export class StateSession {

    public static fromJSON(json: StateSessionJSON): StateSession {
        let stateSession = new StateSession();
        // assign properties...
        stateSession.locked = json.locked;
        stateSession.uniqueId = json.uniqueId;
        stateSession.activePaks = json.activePaks.map(activePakJson => {
            let activePak = ActivePak.fromJSON(activePakJson);
            activePak.stateSession = stateSession;
            return activePak;
        });
        return stateSession;
    }

    public locked: boolean;
    public uniqueId: string;
    public activePaks: ActivePak[] = [];
    public stateRepository: StateRepository;
}

export interface StateSessionJSON {
    locked: boolean;
    uniqueId: string;
    activePaks: ActivePakJSON[];
}
