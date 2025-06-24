import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZCISMeterReadReason(context) {
    //During reads, default reason based on Notification Type/Task
    //Not used during meter install/remove/replace

    var notifNum = CommonLibrary.getStateVariable(context, 'ZNotifNum');
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationHeaders', [], `$filter=NotificationNumber eq '${notifNum}'&$expand=Tasks`).then(function (notifResult) {
        if (notifResult && notifResult.length > 0) {
            let notification = notifResult.getItem(0);
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'ZNotifTypeMeterReadReasons', [], `$filter=ZNotifType eq '${notification.NotificationType}'`).then(function (reasons) {
                if (reasons && reasons.length > 0) {         
                    if (reasons.length > 1) {
                        //More than one reason means it needs to be checked against the Notification task code to determine the default reason code
                        if (notification.Tasks && notification.Tasks.length > 0) {
                            for (var i = 0; i < notification.Tasks.length; i++) {
                                if (notification.Tasks[i].TaskCodeGroup == notification.NotificationType) {
                                    for (var x=0; x < reasons.length; x++) {
                                        var meterReadReason = reasons.getItem(x);
                                        if (notification.Tasks[i].TaskCode == meterReadReason.ZNotifTaskCode) {
                                            return meterReadReason.ZMeterReadReason;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        return reasons.getItem(0).ZMeterReadReason;
                    }
                    
                }
            });

        }
    });

}
