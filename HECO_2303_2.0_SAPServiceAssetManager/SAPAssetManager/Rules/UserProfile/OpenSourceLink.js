/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import isAndroid from '../Common/IsAndroid';
import NativeScriptObject from '../Common/Library/NativeScriptObject';

export default function OpenSourceLink(clientAPI) {
    let url = '';
    if (isAndroid(clientAPI)) {
        url = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/OslnAndroid.global').getValue();
    } else {
        url = clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/OslnIOS.global').getValue();
    }
    return NativeScriptObject.getNativeScriptObject(clientAPI).utilsModule.openUrl(url);
}
