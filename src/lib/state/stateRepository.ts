import { PakDirectory } from '../pak/pakDirectory';
import { StateSession, StateSessionJSON } from './stateSession';
import { StateDirectory } from './stateDirectory';

export interface StateRepository {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
    stateDirectory: StateDirectory;
    getPakDirectory(): Promise<PakDirectory>;
    getStateSession(sessionId: string): Promise<StateSession>;
    getSessionList(): Promise<string[]>;
    toJSON(): StateRepositoryJSON;
}

export interface StateRepositoryJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
    path: string;
}

export type StateRepositoryType = 'LocalStorage' | 'Service' | 'GitHubGist' | 'File';
