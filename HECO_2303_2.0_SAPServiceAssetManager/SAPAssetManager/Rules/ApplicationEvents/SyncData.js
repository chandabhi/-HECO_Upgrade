import DeleteUnusedOverviewEntities from '../Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../Sync/SetSyncInProgressState';
import errorLibrary from '../Common/Library/ErrorLibrary';
import libCom from '../Common/Library/CommonLibrary';
import Logger from '../Log/Logger';
import appSettings from '../Common/Library/ApplicationSettings';

export default function SyncData(clientAPI) {
    clientAPI.getClientData().Error='';
    setSyncInProgressState(clientAPI, true);
    if (!libCom.isInitialSync(clientAPI)) {
        //This is a delta sync
        return DeleteUnusedOverviewEntities(clientAPI).then(()=> {
            errorLibrary.clearError(clientAPI);
            appSettings.remove(clientAPI, 'LocallyIntalledEquip');
            return clientAPI.executeAction('/SAPAssetManager/Actions/OData/ReInitializeOfflineOData.action').then( ()=> {
                return clientAPI.executeAction('/SAPAssetManager/Actions/OData/UploadOfflineData.action');
            }).catch((error) => {
                Logger.error(clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategorySync.global').getValue(),`SyncData(clientAPI) error: ${error}`);
                setSyncInProgressState(clientAPI, false);
            });
        });
    }
    //This is an initial sync
    return clientAPI.getDefinitionValue('/SAPAssetManager/Rules/OData/Download/DownloadDefiningRequest.js').then(()=>{
        setSyncInProgressState(clientAPI, false);
    });
}
