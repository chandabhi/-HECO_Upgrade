import ApplicationSettings from '../Common/Library/ApplicationSettings';
import InitializeOnUserSwitch from './InitializeOnUserSwitch';

/**
* Function that executes when reset action is being called with Skip Reset set to true
* @param {IClientAPI} context
*/
export default function ApplicationOnUserSwitch(context) {
    context.getGlobalSideDrawerControlProxy().setSelectedMenuItemByName('OverviewBlank');
    let provider = context.getODataProvider('/SAPAssetManager/Services/AssetManager.service');
    let storeParameters = provider.getOfflineParameters();
    let headers = storeParameters.getCustomHeaders();
    if (headers) {
        headers.UserSwitch = true;
    } else {
        headers = {'UserSwitch':true};
    }
    storeParameters.setCustomHeaders(headers);
    ApplicationSettings.setBoolean(context,'didUserSwitchDeltaCompleted', false);
    context.showActivityIndicator(context.localizeText('download_progress'));
    return InitializeOnUserSwitch(context);
}
