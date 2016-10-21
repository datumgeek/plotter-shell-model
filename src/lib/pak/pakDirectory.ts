import { PakRepository, PakRepositoryJSON } from './pakRepository';
import { PakRepositoryFile } from './pakRepositoryFile';
import { StateRepository } from '../state/stateRepository';
import { ElectronHelper } from '../electronHelper';
import { PhoneGapHelper } from '../phoneGapHelper';
import { IFileManager } from '../util';

export class PakDirectory {
    public static fromJSON(fileManager: IFileManager, json: PakDirectoryJSON): PakDirectory {
        let pakDirectory = new PakDirectory();
        // assign properties...
        pakDirectory.locked = json.locked;
        pakDirectory.uniqueId = json.uniqueId;
        pakDirectory.pakRepositories = json.pakRepositories.map(pakRepositoryJSON => {
            switch (pakRepositoryJSON.pakRepositoryType) {
                case 'File':
                    let pakRepository = new PakRepositoryFile(
                        fileManager,
                        new ElectronHelper(),
                        new PhoneGapHelper());
                    pakRepository.locked = pakRepositoryJSON.locked;
                    pakRepository.uniqueId = pakRepositoryJSON.uniqueId;
                    pakRepository.pakRepositoryType = pakRepositoryJSON.pakRepositoryType;
                    pakRepository.path = pakRepositoryJSON.path;
                    pakRepository.pakDirectory = pakDirectory;
                    return pakRepository;

                default:
                    throw new Error(`repository ${pakRepositoryJSON.pakRepositoryType} not supported.`);
            }
        });
        return pakDirectory;
    }

    public locked: boolean;
    public uniqueId: string;
    public pakRepositories: PakRepository[];
    public stateRepository: StateRepository;

    public toJSON(): PakDirectoryJSON {
        return JSON.parse(JSON.stringify(this));
    }
}

// A representation of User's data that can be converted to
// and from JSON without being altered.
export interface PakDirectoryJSON {
    locked: boolean;
    uniqueId: string;
    pakRepositories: PakRepositoryJSON[];
}
