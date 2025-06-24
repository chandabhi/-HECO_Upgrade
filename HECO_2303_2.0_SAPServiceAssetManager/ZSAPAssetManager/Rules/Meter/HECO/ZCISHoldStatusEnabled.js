import CommonLibrary from "../../Common/Library/CommonLibrary";
import ZCISHoldStatusUpdate from "./ZCISHoldStatusUpdate";

export default function ZCISHoldStatusEnabled(context) {
    //Only show CIS hold status popup if custom statuses are available for the Notification Type of the assigned Notification

    let binding = context.binding;
    let query;
    if(context.binding['@odata.type'] ==="#sap_mobile.MyWorkOrderHeader"){
        query = `$filter=NotificationNumber eq '${context.binding.NotificationNumber}'`;
        binding=context.binding.Operations[0]
    }
    else{
        query = `$filter=NotificationNumber eq '${context.binding.WOHeader.NotificationNumber}'`
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], query).then(function (notifResult) {
        if (notifResult && notifResult.length > 0) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ZNotifTypeEditableUserStatuses', [], `$filter=ZNotifType eq '${notifResult.getItem(0).NotificationType}'`).then(function (results) {
                if(results && results.length > 0) {
                    CommonLibrary.setStateVariable(context, 'ZOperationHold', binding);
                    ZCISHoldStatusUpdate(context);
                }
                return Promise.resolve();
            });
        }
        return Promise.resolve();
    });

}
