/**
 * Returns true if the confirmation indicator is not 3
 * @param {IClientAPI} context
 */
export default function IsConfirmationEnabledOperation(context) {
    if (!context.binding) return Promise.resolve(false); 
    let binding = context.binding;
    if(context.binding['@odata.type'] ==="#sap_mobile.MyWorkOrderHeader"){
        binding = context.binding.Operations[0];
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ControlKeys', ['ConfirmationIndicator'], "$filter=ControlKey eq '" + binding.ControlKey + "'").then(function(result) {
        if (result.getItem(0).ConfirmationIndicator === '3') {
            return false;
        }
        return true;
    });
}
