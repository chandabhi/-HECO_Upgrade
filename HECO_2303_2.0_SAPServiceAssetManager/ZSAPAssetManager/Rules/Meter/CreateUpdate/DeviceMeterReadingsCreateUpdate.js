import { FDCSectionHelper } from '../../FDC/DynamicPageGenerator';
import localization from '../../Common/Library/LocalizationLibrary';
import libMeter from '../Common/MeterLibrary';
import { GlobalVar } from '../../Common/Library/GlobalCommon';
import MeterReplaceInstall from './MeterReplaceInstall';
import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import countDecimals from '../../Classification/Characteristics/Validation/CharacteristicsCountDecimal';

export default async function DeviceMeterReadingsCreateUpdate(context) {
    let sectionHelper = new FDCSectionHelper(context);
    const pageBinding = context.binding;
    let WarningLimitErrorCounter = 0, ErrorLimiterrorCounter = 0,ProceedErrorLimiterrorCounter = 0,ProceedWarningLimitErrorCounter = 0;

    //HECO Added check for tech install activity
    let techInstall;
    let meterDetails = libCommon.getStateVariable(context, 'ZDeviceDetails');
    context.read('/SAPAssetManager/Services/AssetManager.service', 'MyNotificationTasks', [], `$filter=NotificationNumber eq '${meterDetails.NotifNum}' and TaskCode eq '0040'`).then(function (notifResult) {
        if (notifResult && notifResult.length > 0) {
            //If Notif task 40 exists then use technical install
            techInstall = true;
        }
    }).then( () => {

        sectionHelper.run(async(sectionBinding, section) =>  {
            if (!sectionBinding) {
                return true;
            }

            let now = new Date();
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);
            now.setDate(now.getDate() + 1);

            let dict = { 'ReadingValue': '', 'ReadingTimeControl': '', 'PeakTimeSwitch': '', 'PeakUsageTimeControl': '', 'NotePicker': '' };

            for (let key of Object.keys(dict)) {
                dict[key] = section.getControl(key).getValue();

                if (typeof dict[key] === Array) {
                    dict[key] = dict[key][0].ReturnValue;
                }
            }

            section.getControl('ReadingValue').clearValidation();
            section.getControl('ReadingTimeControl').clearValidation();
            section.getControl('PeakUsageTimeControl').clearValidation();

            section.getControl('ReadingValue').setValidationProperty('ValidationMessage', '');
            section.getControl('ReadingValue').setValidationProperty('ValidationMessageColor', "#fdfbfd");
            section.getControl('ReadingValue').setValidationProperty('ValidationViewBackgroundColor', "#fdfbfd");
            section.getControl('ReadingValue').setValidationProperty('SeparatorIsHidden', false);
            section.getControl('ReadingValue').setValidationProperty('SeparatorBackgroundColor', "#fdfbfd");
            

            let estimateReadingNote = libCommon.getAppParam(context, 'METERREADINGNOTE', 'EstimateMeterReading');

            let result = true;

            let message = '';

            if (libVal.evalIsEmpty(dict.ReadingValue) && !(dict.NotePicker === estimateReadingNote)) {
                result = false;
                message = context.localizeText('field_is_required');
                libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
            }

            if (dict.ReadingTimeControl >= now) {
                result = false;
                message = context.localizeText('validation_reading_time_cannot_be_in_the_future');
                libCommon.executeInlineControlError(context, section.getControl('ReadingTimeControl'), message);
            }

            if (dict.PeakTimeSwitch
                && dict.PeakUsageTimeControl >= now) {
                result = false;
                message = context.localizeText('validation_peak_reading_time_cannot_be_in_the_future');
                libCommon.executeInlineControlError(context, section.getControl('PeakUsageTimeControl'), message);
            }

            if (!localization.isNumber(context, dict.ReadingValue)) {
                result = false;
                message = context.localizeText('validation_reading_is_numeric');
                libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
            }
            // Added logic in done button of take reading screen to make it nonfunctional for wrong reading
            if (countDecimals(localization.toNumber(context, dict.ReadingValue)) > Number(sectionBinding.DecimalAfter)) {
                result = false;
                let dynamicParams = [Number(sectionBinding.DecimalAfter)];
                message = context.localizeText('max_number_of_decimals', dynamicParams);
                libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
            }

            if (((countDecimals(localization.toNumber(context, dict.ReadingValue)) > 0) ? dict.ReadingValue.length - countDecimals(localization.toNumber(context, dict.ReadingValue)) - 1 : dict.ReadingValue.length) > Number(context.binding.DecimalBefore)) {
                result = false;
                let dynamicParams = [Number(sectionBinding.DecimalBefore)];
                message = context.localizeText('max_number_of_char', dynamicParams);
                libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
            }
            // Added set of all different cases to check reading value in take reading screen after pressing done button
            if(dict.ReadingValue){
                let [integerPart, decimalPart] = dict.ReadingValue.toString().split('.');
                let DecimalBefore = parseInt(sectionBinding.DecimalBefore);
                let DecimalAfter=parseInt(sectionBinding.DecimalAfter);
                let leadingZeroesInteger = integerPart.match(/^0*/)[0].length;
                if(integerPart||decimalPart){
                    if(integerPart&&decimalPart){
                        integerPart=integerPart.length;
                        decimalPart=decimalPart.length;
                    }
                    else if(decimalPart){
                        decimalPart=decimalPart.length;
                    }
                    else if(integerPart){
                        integerPart=integerPart.length;
                    }        
                }
                // Below commented code if we want user to at least put one integer values
                // if(!integerPart){
                //     result = false;
                //     message=`Please fill integer values`;
                //     libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);     
                // }
                if(integerPart>DecimalBefore){
                    result = false;
                    message=`Please only fill up to '${DecimalBefore}' integer values`;
                    libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message); 
                }
                if(integerPart&&decimalPart&&decimalPart>DecimalAfter&&integerPart>DecimalBefore){
                    result = false;
                    message=`Please only fill up to '${DecimalBefore}' integer values & '${DecimalAfter}' decimal values`
                    libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
                }
                // If we want to show inline error - if user enters leading 2 zeroes
                // if(integerPart>1&&leadingZeroesInteger>0){
                //     result = false;
                //     message="Please remove the leading zeros";
                //     libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
                // }
                // If we want to show inline error - if all the zeroes in intiger position
                // if(integerPart>1&&leadingZeroesInteger>0&&integerPart===leadingZeroesInteger){
                //     result = false;
                //     message="Please enter a single zero";
                //     libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
                // }
            }
            if(dict.ReadingValue<0){
                result = false;
                message=`Please enter positive values`;
                libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
            }
            //Below logic is to check if the reading value falls under warning and error range
            let equipment = context.binding.EquipmentNum;
            let register = sectionBinding.RegisterNum;
            let MinimumMaxLimit = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=EquipmentNum eq '${equipment}' and Register eq '${register}' and sap.entityexists(ReadLimit_Nav)&$expand=ReadLimit_Nav&$orderby=MeterReadingDate desc, MeterReadingTime desc`);
            
            if(result&&MinimumMaxLimit.getItem(0)&&MinimumMaxLimit.getItem(0).ReadLimit_Nav&&dict.ReadingValue){
                let ErrorMinLimit = MinimumMaxLimit.getItem(0).ReadLimit_Nav.ErrorMinLimit;
                let ErrorMaxLimit = MinimumMaxLimit.getItem(0).ReadLimit_Nav.ErrorMaxLimit;
                let WarningMinLimit=MinimumMaxLimit.getItem(0).ReadLimit_Nav.WarningMinLimit;
                let WarningMaxLimit = MinimumMaxLimit.getItem(0).ReadLimit_Nav.WarningMaxLimit;

                if(section.getControl('WarningMinValue')&&section.getControl('WarningMinValue').getVisible()){
                    if(((dict.ReadingValue<WarningMinLimit&&dict.ReadingValue!=WarningMinLimit)||(dict.ReadingValue>WarningMaxLimit&&dict.ReadingValue!=WarningMaxLimit))&&WarningMaxLimit!=0){
                        message=`The reading is outside the warning tolerance limits.`
                        if(WarningLimitErrorCounter==0&&ProceedWarningLimitErrorCounter==0){
                            await showWarningDialog(context, message, context.localizeText('warning'), 'Proceed', 'Review').then(successResult => {
                                result = successResult;
                                if(successResult==false){
                                    WarningLimitErrorCounter++;
                                }
                                else if(successResult){
                                    ProceedWarningLimitErrorCounter++;
                                }
                            });
                        }
                        if(WarningLimitErrorCounter>0){
                            message=`Warning:The reading is outside the warning tolerance limits. Min = ${WarningMinLimit}; Max = ${WarningMaxLimit}.`
                            libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
                        }
                    }
                }

                if(section.getControl('ErrorMinValue')&&section.getControl('ErrorMinValue').getVisible()){
                    if(((dict.ReadingValue<ErrorMinLimit&&dict.ReadingValue!=ErrorMinLimit)||(dict.ReadingValue>ErrorMaxLimit&&dict.ReadingValue!=ErrorMaxLimit))&&ErrorMaxLimit!=0){
                        message=`The reading is outside the error tolerance limits.`;
                        if(ErrorLimiterrorCounter==0&&ProceedErrorLimiterrorCounter==0){
                            await showWarningDialog(context, message, context.localizeText('warning'), 'Proceed', 'Review').then(successResult => {
                                result = successResult;
                                if(successResult==false){
                                    ErrorLimiterrorCounter++;
                                }
                                else if(successResult){
                                    ProceedErrorLimiterrorCounter++;
                                }
                            });
                        }
                        if(ErrorLimiterrorCounter>0){
                            message=`Warning:The reading is outside the error tolerance limits. Min = ${ErrorMinLimit}; Max = ${ErrorMaxLimit}.`;
                            libCommon.executeInlineControlError(context, section.getControl('ReadingValue'), message);
                        }
                    }
                }
                
            }
            section.getControl('ReadingValue').redraw();
            return result;
        }).then(validationResult => {
            if (validationResult.every(validation => validation === true)) {
                return sectionHelper.run((sectionBinding, section, sectionIndex) => {
                    if (sectionIndex === 0) { // Skip first section
                        return Promise.resolve();
                    }
                    const isPeakReading = section.getControl('PeakTimeSwitch').getValue();
                    const readerNote = (value => {
                        if (value.length > 0) {
                            return value[0].ReturnValue;
                        } else {
                            return '';
                        }
                    })(section.getControl('NotePicker').getValue());
                    //HECO
                    //Additional defaults added. Values pulled from config panel parameters
                    const readingReason = (reasonValue => {
                        let transactionType = libMeter.getMeterTransactionType(context);
                        if (transactionType.startsWith('READING')) {
                            if (reasonValue.length > 0) {
                                return reasonValue[0].ReturnValue;
                            } else {
                                return '';
                            }
                        } else if (transactionType.startsWith('DISCONNECT')) {
                            try {
                                return GlobalVar.getAppParam().METERREASONCODE.Disconnect;
                            } catch (exc) {
                                return '';
                            }
                        } else if (transactionType.startsWith('RECONNECT')) {
                            try {
                                return GlobalVar.getAppParam().METERREASONCODE.Reconnect;
                            } catch (exc) {
                                return '';
                            }
                        } else if (transactionType.startsWith('INSTALL')) {
                            try {
                                if(techInstall) {
                                    return GlobalVar.getAppParam().METERREASONCODE.TechInstall;
                                } else {
                                    return GlobalVar.getAppParam().METERREASONCODE.Install;
                                }
                                
                            } catch (exc) {
                                return '';
                            }
                        } else if (transactionType.startsWith('REMOVE')) {
                            try {
                                return GlobalVar.getAppParam().METERREASONCODE.Remove;
                            } catch (exc) {
                                return '';
                            }
                        } else if (transactionType.startsWith('REPLACE')) {
                            try {
                                return GlobalVar.getAppParam().METERREASONCODE.ReplaceOut;
                            } catch (exc) {
                                return '';
                            }
                        } else if (transactionType.startsWith('REP_INST')) {
                            try {
                                return GlobalVar.getAppParam().METERREASONCODE.ReplaceIn;
                            } catch (exc) {
                                return '';
                            }
                        } else {
                            return '';
                        }
                    })(section.getControl('ReasonPicker').getValue());

                    const reading = localization.toNumber(context, section.getControl('ReadingValue').getValue(), '', false);

                    const meterReadingDocID = String(new Date().getTime()) + '_' + sectionBinding.RegisterNum;
                    const DocID = 'LOCAL_' + meterReadingDocID.substring(meterReadingDocID.length - 10);

                    const readingTransactionMdoHeader = (() => {
                        let meterTransactionType = libMeter.getMeterTransactionType(context);
                        if (meterTransactionType.startsWith('INSTALL') || meterTransactionType.startsWith('REMOVE') || meterTransactionType.startsWith('REPLACE') || meterTransactionType.startsWith('REP_INST')) {
                            return 'SAM2305_DEVICE';
                        } else if (meterTransactionType.startsWith('PERIODIC')) {
                            return 'SAM2305_MR_PERIODIC';
                        }
                        return 'SAM2305_METER_READING';
                    })();

                    let equipmentNum = '';
                    if (pageBinding && pageBinding.DeviceLink) {
                        equipmentNum = pageBinding.DeviceLink.EquipmentNum;
                    } else if (pageBinding && pageBinding.Device_Nav) {
                        equipmentNum = pageBinding.Device_Nav.EquipmentNum;
                    } else if (context.binding && context.binding.DeviceLink) {
                        equipmentNum = context.binding.DeviceLink.EquipmentNum;
                    } else if (sectionBinding && sectionBinding.Device_Nav) {
                        equipmentNum = context.binding.Device_Nav.EquipmentNum;
                    }

                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MeterReadings', [], `$filter=sap.islocal() and RegisterGroup eq '${sectionBinding.RegisterGroup}' and Register eq '${sectionBinding.RegisterNum}' and EquipmentNum eq '${equipmentNum}'`).then(function (result) {
                        let readLink = '';

                        if (result.length > 0 && (readLink = result.getItem(0)['@odata.readLink'])) {
                            sectionBinding.MeterReadingReadLink = readLink;

                            let updateProps = {
                                'MeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                                'MeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                                'ActualMeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                                'ActualMeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                                'MeterReadingRecorded': reading,
                                'MeterReaderNote': readerNote,
                                'MeterReadingReason': readingReason,
                                "ZMeterIRRWorkOrder": "/SAPAssetManager/Rules/Meter/CreateUpdate/ZMeterOrderId.js",
                                "ZMeterIRRNotification": "/SAPAssetManager/Rules/Meter/CreateUpdate/ZMeterNotifNum.js"
                            };

                            if (isPeakReading) {
                                updateProps.DateMaxRead = '/SAPAssetManager/Rules/Meter/PeakDate.js';
                                updateProps.TimeMaxReading = '/SAPAssetManager/Rules/Meter/PeakTime.js';
                            }

                            // a reading exists, do updates
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/Common/GenericUpdate.action', 'Properties': {
                                    'Target': {
                                        'EntitySet': 'MeterReadings',
                                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                                        'ReadLink': sectionBinding.MeterReadingReadLink,
                                    },
                                    'Properties': updateProps,
                                    'Headers':
                                    {
                                        'OfflineOData.TransactionID': '#Property:BatchEquipmentNum',
                                        'transaction.omdo_id': '/SAPAssetManager/Rules/Meter/Reading/ReadingTransactionMdoHeader.js',
                                    },
                                    'RequestOptions': {
                                        'UpdateMode': 'Replace',
                                    },
                                    'ShowActivityIndicator': true,
                                    'ActivityIndicatorText': '  ',
                                }
                            });
                        } else {
                            // no existing reading, do creates
                            let createProps = {
                                'MeterReadingDocID': DocID,
                                'Register': sectionBinding.RegisterNum,
                                'RegisterGroup': sectionBinding.RegisterGroup,
                                'MeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                                'MeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                                'ActualMeterReadingDate': '/SAPAssetManager/Rules/Meter/CurrentDate.js',
                                'ActualMeterReadingTime': '/SAPAssetManager/Rules/Meter/CurrentTime.js',
                                'MeterReadingRecorded': reading,
                                'MeterReaderNote': readerNote,
                                'MeterReadingReason': readingReason,
                                'PreviousReadingFloat': '/SAPAssetManager/Rules/Meter/PreviousReadingFloat.js',
                                'PreviousReadingDate': '/SAPAssetManager/Rules/Meter/PreviousReadingDate.js',
                                'PreviousReadingTime': '/SAPAssetManager/Rules/Meter/PreviousReadingTime.js',
                                "ZMeterIRRWorkOrder": "/SAPAssetManager/Rules/Meter/CreateUpdate/ZMeterOrderId.js",
                                "ZMeterIRRNotification": "/SAPAssetManager/Rules/Meter/CreateUpdate/ZMeterNotifNum.js"
                            };

                            if (isPeakReading) {
                                createProps.DateMaxRead = '/SAPAssetManager/Rules/Meter/PeakDate.js';
                                createProps.TimeMaxReading = '/SAPAssetManager/Rules/Meter/PeakTime.js';
                            }
                            return context.executeAction({
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
                                        'OfflineOData.TransactionID': context.binding.BatchEquipmentNum,
                                        'transaction.omdo_id': readingTransactionMdoHeader,
                                    },
                                    'CreateLinks':
                                        [{
                                            'Property': 'Device_Nav',
                                            'Target':
                                            {
                                                'EntitySet': 'Devices',
                                                'ReadLink': context.binding.DeviceLink['@odata.readLink'],
                                            },
                                        }],
                                }
                            });
                        }
                    });
                }).then(() => {
                    return MeterReplaceInstall(context);
                });
            } else {
                return Promise.resolve();
            }
        });
    });
}
function showWarningDialog(
    clientAPI,
    messageText,
    captionText = clientAPI.localizeText('validation_warning'),
    okButtonText = clientAPI.localizeText('ok'),
    cancelButtonText = clientAPI.localizeText('cancel')) {
    clientAPI.dismissActivityIndicator();

    if (!clientAPI.getPageProxy) {
        clientAPI.getClientData().DialogMessage = messageText;
        clientAPI.getClientData().DialogTitle = captionText;
        clientAPI.getClientData().DialogOkCaption = okButtonText;
        clientAPI.getClientData().DialogCancelCaption = cancelButtonText;
    } else {
        clientAPI.getPageProxy().getClientData().DialogMessage = messageText;
        clientAPI.getPageProxy().getClientData().DialogTitle = captionText;
        clientAPI.getPageProxy().getClientData().DialogOkCaption = okButtonText;
        clientAPI.getPageProxy().getClientData().DialogCancelCaption = cancelButtonText;
    }

    return clientAPI.executeAction('/SAPAssetManager/Actions/Common/GenericWarningDialog.action').then(function(result) {
        if (result.data === true) {
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    });
}
