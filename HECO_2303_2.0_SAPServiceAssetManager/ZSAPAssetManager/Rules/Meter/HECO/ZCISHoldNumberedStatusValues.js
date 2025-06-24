import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZCISHoldNumberedStatusValues(context) {
    //Populates picker with valid numbered user statuses for the assigned notification type

    let operHold = CommonLibrary.getStateVariable(context, 'ZOperationHold');
    let query = `$filter=NotificationNumber eq '${operHold.WOHeader.NotificationNumber}'`
    if(context.binding['@odata.type'] ==="#sap_mobile.MyWorkOrderHeader"){
        query = `$filter=NotificationNumber eq '${context.binding.NotificationNumber}'`;
        binding=context.binding.Operations[0]
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], query).then(function (notifResult) {
        if (notifResult && notifResult.length > 0) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ZNotifTypeEditableUserStatuses', [], `$filter=ZNotifType eq '${notifResult.getItem(0).NotificationType}' and ZNumberedUserStatusCode ne null`).then(function (results) {
                let pickerValues = [];

                for (let i = 0; i < results.length; i++) {
                    let currValue = results.getItem(i);
                    if(currValue.ZNumberedUserStatusCode) {
                        pickerValues.push({ 'DisplayValue': `${currValue.ZNumberedUserStatusCode} - ${currValue.ZNumberedUserStatusDesc}`, 'ReturnValue': currValue.ZNumberedUserStatusCode });
                    }
                }

                return pickerValues;
            });
        }
    });
}
