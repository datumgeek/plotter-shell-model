import { StateRepository, StateRepositoryType, StateRepositoryJSON } from './stateRepository';
import { PakDirectory, PakDirectoryJSON } from '../pak/pakDirectory';
import { StateSession, StateSessionJSON } from './stateSession';
import { StateDirectory, StateDirectoryJSON } from './stateDirectory';
import { ElectronHelper } from '../electronHelper';
import { PhoneGapHelper } from '../phoneGapHelper';
import { IFileManager } from '../util';

export class StateRepositoryFile implements StateRepository {
    public static fromJSON(fileManager: IFileManager, json: StateRepositoryJSON): StateRepositoryFile {
        let stateRepository = new StateRepositoryFile(fileManager, new ElectronHelper(), new PhoneGapHelper());
        // assign properties...
        stateRepository.locked = json.locked;
        stateRepository.uniqueId = json.uniqueId;
        stateRepository.stateRepositoryType = json.stateRepositoryType;
        stateRepository.path = json.path;
        return stateRepository;
    }

    public locked = false;
    public uniqueId = 'state-repository';
    public stateRepositoryType: StateRepositoryType = 'File';
    public stateDirectory: StateDirectory;
    public path: string;

    private pakDirectoryPromise: Promise<PakDirectory>;
    private stateSessionPromiseMap = new Map<string, Promise<StateSession>>();
    private stateSessionMap = new Map<string, StateSession>();

    constructor(
        private fileManager: IFileManager,
        private electronHelper: ElectronHelper,
        private phoneGapHelper: PhoneGapHelper) { }

    public getPakDirectory = () => {

        if (this.pakDirectoryPromise) {
            return this.pakDirectoryPromise;
        }

        let that = this;
        return this.pakDirectoryPromise = new Promise<PakDirectory>((resolve, reject) => {

            if (that.electronHelper.isElectron) {
                let fs = that.electronHelper.fs;
                let resourcePath = that.electronHelper.userDataPath;

                fs.readFile(`${resourcePath}/${that.path}/${that.uniqueId}/pak-directory.json`,
                    (reason: any, stringData: string) => {
                        if (reason) {
                            reject(new Error(`fetch pak-directory failed: reason: \r\n\r\n${reason}`));
                            return;
                        }

                        let data = JSON.parse(stringData);

                        let pakDirectory = PakDirectory.fromJSON(that.fileManager, data);
                        pakDirectory.stateRepository = that;
                        resolve(pakDirectory);
                        return;
                    });
            } else if (that.phoneGapHelper.isPhoneGap) {
                let pakDirectoryFile = `${that.path}/${that.uniqueId}/pak-directory.json`;

                that.phoneGapHelper.readFromFile(`${pakDirectoryFile}`)
                    .then((o: any) => {
                        let pakDirectory = PakDirectory.fromJSON(that.fileManager, o);
                        pakDirectory.stateRepository = that;
                        resolve(pakDirectory);
                    })
                    .catch(r => reject(r.toString()));
            } else {

                that.fileManager.get([that.path, that.uniqueId, 'pak-directory.json'])
                    .then((data: PakDirectoryJSON) => {
                        let pakDirectory = PakDirectory.fromJSON(that.fileManager, data);
                        pakDirectory.stateRepository = that;
                        resolve(pakDirectory);
                    })
                    .catch(reason => {
                        reject(new Error(`fetch pak-directory failed: reason: \r\n\r\n${reason}`));
                    });
            }
        });

    }

    public getStateSession(sessionId: string): Promise<StateSession> {

        if (this.stateSessionPromiseMap.has(sessionId)) {
            return this.stateSessionPromiseMap.get(sessionId);
        }

        let that = this;
        let stateSessionPromise = new Promise<StateSession>((resolve, reject) => {

            if (that.electronHelper.isElectron) {
                let fs = that.electronHelper.fs;
                let resourcePath = that.electronHelper.userDataPath;

                fs.readFile(`${resourcePath}/${that.path}/${that.uniqueId}/${sessionId}.json`, (reason: any, stringData: string) => {
                    if (reason) {
                        reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                        return;
                    }

                    let data = JSON.parse(stringData);

                    let stateSession = StateSession.fromJSON(data);
                    stateSession.stateRepository = that;
                    that.stateSessionMap.set(sessionId, stateSession);
                    resolve(stateSession);
                    return;
                });
            } else if (that.phoneGapHelper.isPhoneGap) {
                let stateSessionFile = `${that.path}/${that.uniqueId}/${sessionId}.json`;

                that.phoneGapHelper.readFromFile(`${stateSessionFile}`)
                    .then((o: any) => {
                        let stateSession = StateSession.fromJSON(o);
                        stateSession.stateRepository = that;
                        that.stateSessionMap.set(sessionId, stateSession);
                        resolve(stateSession);
                    })
                    .catch(r => reject(r));
            } else {

                that.fileManager.get([that.path, that.uniqueId, `${sessionId}.json`])
                    .then((data: StateSessionJSON) => {
                        let stateSession = StateSession.fromJSON(data);
                        stateSession.stateRepository = that;
                        that.stateSessionMap.set(sessionId, stateSession);
                        resolve(stateSession);
                    })
                    .catch(reason => {
                        reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                    });
            }
        });

        this.stateSessionPromiseMap.set(sessionId, stateSessionPromise);
        return stateSessionPromise;
    }
    public getSessionList() {
        let that = this;

        return new Promise<string[]>((resolve, reject) => {

            if (that.electronHelper.isElectron) {
                let fs = that.electronHelper.fs;
                let resourcePath = that.electronHelper.userDataPath;

                fs.readFile(`${resourcePath}/${that.path}/${that.uniqueId}/session-list.json`, (reason: any, stringData: string) => {
                    if (reason) {
                        reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                        return;
                    }

                    let data = JSON.parse(stringData);

                    resolve(<string[]>data.sessionList);
                    return;
                });
            } else if (that.phoneGapHelper.isPhoneGap) {
                let sessionListFile = `${that.path}/${that.uniqueId}/session-list.json`;

                that.phoneGapHelper.readFromFile(`${sessionListFile}`)
                    .then((data: any) => {
                        resolve(<string[]>data.sessionList);
                    })
                    .catch(r => reject(r));
            } else {

                that.fileManager.get([that.path, that.uniqueId, 'session-list.json'])
                    .then((data: { sessionList: string[]}) => {
                        resolve(data.sessionList);
                    })
                    .catch(reason => {
                        reject(new Error(`fetch session list: reason: \r\n\r\n${reason}`));
                    });
            }
        });
    }
    public toJSON(): StateRepositoryJSON {
        return {
            locked: this.locked,
            stateRepositoryType: this.stateRepositoryType,
            uniqueId: this.uniqueId,
            path: this.path,
        };
    }
}

export interface StateRepositoryFileJSON {
    locked: boolean;
    uniqueId: string;
    stateRepositoryType: StateRepositoryType;
}

// 
