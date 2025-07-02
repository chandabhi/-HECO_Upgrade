import {MarkedJob as libMarkedJob} from '../../../SAPAssetManager/Rules/UserPreferences/UserPreferencesLibrary';

export default function MarkedJobCreateUpdateOnCommit(pageProxy) {
    return libMarkedJob.createUpdateOnCommitFromWoUpdate(pageProxy);
}
