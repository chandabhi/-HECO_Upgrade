import IsAndroid from '../Common/IsAndroid';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function LaunchAppStore(context) {
    if (IsAndroid(context)) {
        return context.nativescript.utilsModule.openUrl(context.getGlobalDefinition('/SAPAssetManager/Globals/EPD/PlayStoreURL.global').getValue());
    }
    return context.nativescript.utilsModule.openUrl(context.getGlobalDefinition('/SAPAssetManager/Globals/EPD/AppStoreURL.global').getValue());
}
