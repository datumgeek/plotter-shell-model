import { PakRepository, PakRepositoryType } from './pakRepository';
import { Pak, PakJSON } from './pak';
import { PakDirectory } from './pakDirectory';
import { ElectronHelper } from '../electronHelper';
import { PhoneGapHelper } from '../phoneGapHelper';
import { IFileManager } from '../util';

export class PakRepositoryFile implements PakRepository {
    public locked = false;
    public uniqueId = 'state-provider';
    public pakRepositoryType: PakRepositoryType = 'File';
    public pakDirectory: PakDirectory;
    public path: string;
    public pakList: string[];

    private pakMap = new Map<string, Pak>();
    private pakPromiseMap = new Map<string, Promise<Pak>>();

    constructor(
        private fileManager: IFileManager,
        private electronHelper: ElectronHelper,
        private phoneGapHelper: PhoneGapHelper) { }

    public getPak = (pakId: any): Promise<Pak> => {

        if (this.pakPromiseMap.has(pakId)) {
            return this.pakPromiseMap.get(pakId);
        }

        let that = this;
        let pakPromise = new Promise<Pak>((resolve, reject) => {

            if (that.electronHelper.isElectron) {
                let fs = that.electronHelper.fs;
                let resourcePath = that.electronHelper.userDataPath;

                fs.readFile(`${resourcePath}/${that.path}/${that.uniqueId}/${pakId}.json`, (reason: any, stringData: string) => {
                    if (reason) {
                        reject(new Error(`fetch pak failed: reason: \r\n\r\n${reason}`));
                        return;
                    }

                    let data = JSON.parse(stringData);

                    let pak = Pak.fromJSON(data);
                    pak.pakRepository = that;
                    that.pakMap.set(pakId, pak);
                    resolve(pak);
                    return;
                });
            } else if (that.phoneGapHelper.isPhoneGap) {
                let pakFile = `${that.path}/${that.uniqueId}/${pakId}.json`;

                that.phoneGapHelper.readFromFile(`${pakFile}`)
                    .then((o: any) => {
                        let pak = Pak.fromJSON(o);
                        pak.pakRepository = that;
                        that.pakMap.set(pakId, pak);
                        resolve(pak);
                    })
                    .catch(r => reject(r));
            } else {

                that.fileManager.get([that.path, that.uniqueId, `${pakId}.json`])
                    .then(data => {
                        let pak = Pak.fromJSON(<PakJSON>data);
                        pak.pakRepository = that;
                        that.pakMap.set(pakId, pak);
                        resolve(pak);
                    })
                    .catch(reason => {
                        reject(new Error(`fetch pak failed: reason: \r\n\r\n${reason}`));
                    });
            }
        });

        this.pakPromiseMap.set(pakId, pakPromise);
        return pakPromise;
    }
    public getPakList = (): Promise<string[]> => {
        let that = this;

        return new Promise<string[]>((resolve, reject) => {

            if (that.electronHelper.isElectron) {
                let fs = that.electronHelper.fs;
                let resourcePath = that.electronHelper.userDataPath;

                fs.readFile(`${resourcePath}/${that.path}/${that.uniqueId}/pak-list.json`, (reason: any, stringData: string) => {
                    if (reason) {
                        reject(new Error(`fetch pak list failed: reason: \r\n\r\n${reason}`));
                        return;
                    }

                    let data = JSON.parse(stringData);

                    that.pakList = data.pakList;
                    resolve(<string[]>data.pakList);
                    return;
                });
            } else if (that.phoneGapHelper.isPhoneGap) {
                let pakListFile = `${that.path}/${that.uniqueId}/pak-list.json`;

                that.phoneGapHelper.readFromFile(`${pakListFile}`)
                    .then((o: any) => {
                        that.pakList = o.pakList;
                        resolve(<string[]>o.pakList);
                    })
                    .catch(r => reject(r));
            } else {

                that.fileManager.get([that.path, that.uniqueId, 'pak-list.json'])
                    .then(data => {
                        that.pakList = (<PakRepository>data).pakList;
                        resolve(that.pakList);
                    })
                    .catch(reason => {
                        reject(new Error(`fetch pak list failed: reason: \r\n\r\n${reason}`));
                    });
            }
        });
    }
}
