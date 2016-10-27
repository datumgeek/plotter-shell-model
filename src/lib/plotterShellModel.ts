import { StateDirectory, StateDirectoryJSON } from './state/stateDirectory';
import { StateRepository } from './state/stateRepository';
import { StateSession } from './state/stateSession';
import { IFileManager } from './util';
import { ElectronHelper } from './electronHelper';
import { PhoneGapHelper } from './phoneGapHelper';

export class PlotterShellModel {

    public electronHelper = new ElectronHelper();
    public phoneGapHelper = new PhoneGapHelper();

    constructor(public fileManager: IFileManager) {}

    public start(): Promise<StateDirectory> {
        let that = this;

        return new Promise<StateDirectory>((resolve, reject) => {

            let sdn = that.stateDirectoryName;

            // check if sdn has prefix (service:, githubgist:myStateDir[.json], localstorage:)
            if (sdn.toLowerCase().startsWith('service:')) {
                reject('service not supported yet.');
            } else
                if (sdn.toLowerCase().startsWith('githubgist:')) {
                    reject('githubgist not supported yet.');
                } else
                    if (sdn.toLowerCase().startsWith('localstorage:')) {
                        reject('localstorage not supported yet.');
                    } else {

                        // check if (and use) platform origin has state-directory
                        // this.httpClient.baseUrl = 'http://localhost:9000/';

                        if (that.electronHelper.isElectron) {
                            let fs = that.electronHelper.fs;
                            let resourcePath = that.electronHelper.userDataPath;

                            fs.readFile(`${resourcePath}/${sdn}.json`, (err: any, stringData: any) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                let data = JSON.parse(stringData);

                                let stateDirectory = StateDirectory.fromJSON(that.fileManager, data);
                                that.stateDirectory = stateDirectory;
                                resolve(stateDirectory);
                                return;
                            });
                        } else if (that.phoneGapHelper.isPhoneGap) {
                            that.phoneGapHelper.readFromFile(`${sdn}.json`)
                                .then((o: any) => {
                                    let stateDirectory = StateDirectory.fromJSON(that.fileManager, o);
                                    that.stateDirectory = stateDirectory;
                                    resolve(stateDirectory);
                                })
                                .catch(r => reject(r));
                        } else {
                            that.fileManager.get([`${sdn}.json`])
                                .then(data => {
                                    let stateDirectory = StateDirectory.fromJSON(that.fileManager, <StateDirectoryJSON>data);
                                    that.stateDirectory = stateDirectory;
                                    resolve(stateDirectory);
                                })
                                .catch(reason => {
                                    reject(new Error(`fetch state-dictionary2: reason: \r\n\r\n${reason}`));
                                });

                            // check if (and use) local storage has state-directory

                            // create state-directory in local storage
                        }
                    }
        });
    }

    public stateDirectoryName: string = 'state-directory';

    private myStateDirectory: StateDirectory;
    public get stateDirectory() {
        return this.myStateDirectory;
    }
    public set stateDirectory(value) {
        this.myStateDirectory = value;
    }

    private myStateRepository: StateRepository;
    public get stateRepository() {
        return this.myStateRepository;
    }
    public set stateRepository(value) {
        this.myStateRepository = value;
    }

    private myStateSession: StateSession;
    public get stateSession() {
        return this.myStateSession;
    }
    public set stateSession(value) {
        this.myStateSession = value;
    }
}
