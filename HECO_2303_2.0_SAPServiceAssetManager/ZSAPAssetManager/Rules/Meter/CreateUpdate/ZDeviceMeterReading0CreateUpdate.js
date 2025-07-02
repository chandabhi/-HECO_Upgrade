
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import libCommon from '../../Common/Library/CommonLibrary';
import MeterReplaceInstall from './MeterReplaceInstall';

export default async function ZDeviceMeterReading0CreateUpdate(context) {
    const pageBinding = context.binding;

    //HECO Added check for tech install activity
    let techInstall;
    let meterDetails = libCommon.getStateVariable(context, 'ZDeviceDetails');
    context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationTasks', [], `$filter=NotificationNumber eq '${meterDetails.NotifNum}' and TaskCode eq '0040'`).then(function (notifResult) {
        if (notifResult && notifResult.length > 0) {
            //If Notif task 40 exists then use technical install
            techInstall = true;
        }
    }).then(() => {
        let now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);
        now.setDate(now.getDate() + 1);
        meterDetails = libCommon.getStateVariable(context, 'ZDeviceDetails');
        let readingObj = libCommon.getStateVariable(context, 'METERREADINGOBJ');
        let RegisterGroup = readingObj.DeviceLink.RegisterGroup;
        for (const register of readingObj.DeviceLink.RegisterGroup_Nav.Registers_Nav) {
            let RegisterNum = register.RegisterNum
        // let RegisterNum =readingObj.DeviceLink.RegisterGroup_Nav?.Registers_Nav[0]?.RegisterNum;
        // let equipentnum = readingObj.DeviceLink.EquipmentNum;
        // Transaction id had been changed to old meter number to sent all data in one batch
            let equipentnum = context.binding?.Device_Nav?.EquipmentNum || readingObj?.DeviceLink?.EquipmentNum;
            let readingTransactionMdoHeader = 'SAM2305_DEVICE';

            let readingReason = '';
            if (readingObj.ISUProcess.startsWith('INSTALL')) {
                if(techInstall) {
                    readingReason = GlobalVar.getAppParam().METERREASONCODE.TechInstall;
                } else {readingReason = GlobalVar.getAppParam().METERREASONCODE.Install; }
            } else if (readingObj.ISUProcess.startsWith('REPLACE')) {
                readingReason = GlobalVar.getAppParam().METERREASONCODE.ReplaceOut;
            } else if (readingObj.ISUProcess.startsWith('REP_INST')) {
                readingReason = GlobalVar.getAppParam().METERREASONCODE.ReplaceIn;
            }

            const meterReadingDocID = String(new Date().getTime()) + '_' + RegisterNum;
            const DocID = 'LOCAL_' + meterReadingDocID.substring(meterReadingDocID.length - 10);

            let readerNote = '';
            switch (readingObj.ISUProcess) {
                    case 'INSTALL':
                    case 'INST':
                        readerNote = 'INST';
                        break;
                    case 'REP_INST':
                    case 'REPLACE':
                        readerNote = 'REPL';
                        break;
                    default:
                        break;
                };

           
                let createProps = {
                    'MeterReadingDocID': DocID,
                    'Register': RegisterNum,
                    'RegisterGroup': RegisterGroup,
                    'MeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                    'MeterReadingTime': '/SAPAssetManager/Rules/Meter/CSurrentTime.js',
                    'ActualMeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                    'ActualMeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                    'MeterReadingRecorded': '0',
                    'MeterReaderNote': readerNote,
                    'MeterReadingReason': readingReason,
                    'PreviousReadingFloat': '/SAPAssetManager/Rules/Meter/PreviousReadingFloat.js',
                    'PreviousReadingDate': '/SAPAssetManager/Rules/Meter/PreviousReadingDate.js',
                    'PreviousReadingTime': '/SAPAssetManager/Rules/Meter/PreviousReadingTime.js',
                    "ZMeterIRRWorkOrder": readingObj.DeviceLink.ZMeterIRRWorkOrder,//"/SAPAssetManager/Rules/Meter/CreateUpdate/ZMeterOrderId.js",
                    "ZMeterIRRNotification": readingObj.DeviceLink.ZMeterIRRNotification //"/SAPAssetManager/Rules/Meter/CreateUpdate/ZMeterNotifNum.js"
                };
                context.executeAction({
                    'Name': '/SAPAssetManager/Actions/Common/GenericCreate.action', 'Properties': {
                        'ActionResult': {
                            '_Name': 'CreateMeterReading',
                        },
                        '_Type': 'Action.Type.ODataService.CreateEntity',
                        'Target': {
                            'EntitySet': 'MeterReadings',
                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                        },
                        'Properties': createProps,
                        'Headers':
                        {
                            'OfflineOData.RemoveAfterUpload': 'true',
                            'OfflineOData.TransactionID': equipentnum,
                            'transaction.omdo_id': readingTransactionMdoHeader,
                        },
                        'CreateLinks':
                            [{
                                'Property': 'Device_Nav',
                                'Target':
                                {
                                    'EntitySet': 'Devices',
                                    'ReadLink': readingObj.DeviceLink['@odata.readLink'],
                                },
                            }],
                    }
                });
        }
             
    }).then(() => {
        return MeterReplaceInstall(context);
    });
}