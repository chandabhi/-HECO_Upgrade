import DeleteUnusedOverviewEntities from '../../../SAPAssetManager/Rules/Confirmations/Init/DeleteUnusedOverviewEntities';
import setSyncInProgressState from '../../../SAPAssetManager/Rules/Sync/SetSyncInProgressState';
import errorLibrary from '../../../SAPAssetManager/Rules/Common/Library/ErrorLibrary';
import libCom from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import Logger from '../../../SAPAssetManager/Rules/Log/Logger';
import appSettings from '../../../SAPAssetManager/Rules/Common/Library/ApplicationSettings';

export default function SyncData(clientAPI) {
    clientAPI.getClientData().Error='';
    setSyncInProgressState(clientAPI, true);
    if (!libCom.isInitialSync(clientAPI)) {
        //This is a delta sync
        return DeleteUnusedOverviewEntities(clientAPI).then(()=> {
            // MDK's solution to issue https://sapjira.wdf.sap.corp/browse/ICMTANGOAMF10-9879
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
