import CommonLibrary from "../../Common/Library/CommonLibrary";

export default function ZCISHoldStatusSave(context) {
    //HECO
    //Save status selections as an extra mobile status update to mimic previous Work Manager functionality
    //Further backend enhancements pick up the status change and update the related Notification's user status
    const holdMobileStatus = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const startMobileStatus = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    let status = CommonLibrary.getListPickerValue(context.getControls()[0].getControl('StatusPicker').getValue());
    let complementaryStatus = CommonLibrary.getListPickerValue(context.getControls()[0].getControl('ComplementaryStatusPicker').getValue());
    let operHold = CommonLibrary.getStateVariable(context, 'ZOperationHold');
    let LongTextNote = context.getControls()[0].getControl('LongTextNote').getValue();
    let NotificationNumber = operHold.WOHeader.NotificationNumber;   
    
    //To replicate Work Manager functionality where Notif status changes are tied to the Operation hold,
    //the Start status will be sent followed by a Hold update with the custom statuses for the notifications.
    //This is done for the following reasons:
    //  - SAM only sends changed data and ignores status updates with the same values. 
    //  - SAM defines variables for status changes before the Hold is actually triggered
    //  - A custom status can not be used without overhauling the status engine
    //  - Going from hold, to start and back to hold is a standard process and will not break other dependencies
    let properties = {
        'ObjectKey': operHold.ObjectKey,
        'ObjectType': operHold.ObjectType,
        'MobileStatus': startMobileStatus,
        'CreateUserGUID': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
        'CreateUserId': '/SAPAssetManager/Rules/MobileStatus/GetSAPUserId.js',
        'EffectiveTimestamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
    };
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationHoldUpdate.action', 'Properties': {
            'Properties': properties,
            'Target': {
                'EntitySet': 'PMMobileStatuses',
                'Service': '/SAPAssetManager/Services/AssetManager.service',
                'ReadLink': operHold.OperationMobileStatus_Nav['@odata.readLink'],
            },
        }
    }).then(() => {
        properties = {
            'ObjectKey': operHold.ObjectKey,
            'ObjectType': operHold.ObjectType,
            'MobileStatus': holdMobileStatus,
            'CreateUserGUID': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
            'CreateUserId': '/SAPAssetManager/Rules/MobileStatus/GetSAPUserId.js',
            'ZRelatedObjectType': "QMI",
            'ZRelatedObjectNumberedUserStatus': status,
            'ZRelatedObjectUnnumberedUserStatus': complementaryStatus,
            'EffectiveTimestamp': '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
        };
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationHoldUpdate.action', 'Properties': {
                'Properties': properties,
                'RequestOptions': {
                    'UpdateMode': 'Replace',
                },
                'Target': {
                    'EntitySet': 'PMMobileStatuses',
                    'Service': '/SAPAssetManager/Services/AssetManager.service',
                    'ReadLink': operHold.OperationMobileStatus_Nav['@odata.readLink'],
                },
                'OnSuccess': '/SAPAssetManager/Actions/Page/ClosePage.action',
            }}).then(() => {
                //Cleanup Operation binding
                CommonLibrary.removeStateVariable(context, 'ZOperationHold');
            }).then( async ()  => {
                let query = `$filter = NotificationNumber eq '${NotificationNumber}'`
                let result = await context.read('/SAPAssetManager/Services/AssetManager.service',"MyNotifHeaderLongTexts",[], query);
                let textString = '';
                let ReadLink = '';
                let action = '';
                //Used for when Notification already has notes
                if (result._array.length>0) {
                    textString =result.getItem(0).TextString;
                    textString = textString  + '\n\n' + LongTextNote;
                    textString.trim()
                    ReadLink=result.getItem(0)['@odata.readLink']
                    action = '/SAPAssetManager/Actions/Notes/Update/NotificationNoteUpdate.action'
                    properties = {
                        'NewTextString' : LongTextNote,
                        'NotificationNumber' : NotificationNumber,
                        'TextString' : textString
                    };
                    return context.executeAction({
                        'Name': action, 'Properties': {
                            'Properties': properties,
                            "Headers": {
                                "OfflineOData.TransactionID": NotificationNumber
                            },
                            "UpdateLinks":'',
    
                        
                        'Target': {
                                'EntitySet': 'MyNotifHeaderLongTexts',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                                'ReadLink': ReadLink,
                            }
                            
    
                        }});
                }
                else { //Used when Notif doesn't have preset notes
                    action = '/SAPAssetManager/Actions/Notes/Notifications/NoteCreateDuringNotificationCreate.action'
                    textString = LongTextNote;  
                    properties = {
                        'NewTextString' : LongTextNote,
                        'NotificationNumber' : NotificationNumber,
                        'TextString' : textString
                    };
                    return context.executeAction({
                        'Name': action, 
                        'Properties' : {
                            'Properties': properties,
                            "Headers": {
                                "OfflineOData.RemoveAfterUpload": "true",
                                "OfflineOData.TransactionID": NotificationNumber
                            },
                            "CreateLinks":"/SAPAssetManager/Rules/Notes/ZNoteOperCreateLink.js",
                            'Target': {
                                'EntitySet': 'MyNotifHeaderLongTexts',
                                'Service': '/SAPAssetManager/Services/AssetManager.service',
                            }
                        }
                    })
                }
                return true;    
            })
    });



}
