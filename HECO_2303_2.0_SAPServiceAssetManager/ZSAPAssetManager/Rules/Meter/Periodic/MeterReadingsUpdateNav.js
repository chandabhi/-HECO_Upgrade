import {DynamicPageGenerator} from '../../FDC/DynamicPageGenerator';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function MeterReadingsUpdateNav(context) {
    const sectionData =
    [{
        'Controls':
        [{
            'Caption': '$(L,serial_number)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/MeterReadingCreateSerialNumber.js',
            '_Name': 'SerialNumber',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,device_category)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/MeterReadingCreateDeviceCategory.js',
            '_Name': 'DeviceCategory',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        }],
        '_Type': 'Section.Type.FormCell',
    },
    {
        'Target': {
            'EntitySet': '{{#Property:@odata.readLink}}/Device_Nav/PeriodicMeterReading_Nav',
            'Service': '/SAPAssetManager/Services/AssetManager.service',
            'QueryOptions': '/SAPAssetManager/Rules/Meter/Reading/Periodic/MeterReadingQueryOptions.js',
        },
        'Controls':
        [{
            'Caption': '$(L,register)',
            'IsEditable': false,
            'Value': '{Register}',
            '_Name': 'RegisterNum',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,zregisterid)',
            'IsEditable': false,
            'Value': '{ZRegisterId}',
            '_Name': 'RegisterId',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,reading)',
            'IsEditable': true,
            'Value': '{MeterReadingRecorded}',
            'PlaceHolder': 'None',
            '_Name': 'ReadingValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/MeterReadingUpdateCaptionWrapper.js',
        },
        {
            'Caption': '$(L,date_time)',
            'IsEditable': true,
            'Mode': 'DateTime',
            'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            'DateTimeEntryMode': 'datetime',
            '_Name': 'ReadingTimeControl',
            '_Type': 'Control.Type.FormCell.DatePicker',
        },
        {
            'Caption': '$(L,previous_reading)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/HECO/ZCISPreviousReading.js',
            '_Name': 'PrevReading',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,zprevious_reading_status)',
            'IsEditable': false,
            'Value': '/SAPAssetManager/Rules/Meter/HECO/ZCISPreviousReadingStatus.js',
            '_Name': 'PrevReadingStatus',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Caption': '$(L,set_usage_peak_time)',
            'IsEditable': true,
            'Value': '{UsagePeakTimeBool}',
            'OnValueChange': '/SAPAssetManager/Rules/Meter/Reading/PeakUsageShowHideMultiple.js',
            '_Name': 'PeakTimeSwitch',
            '_Type': 'Control.Type.FormCell.Switch',
        },
        {
            'Caption': '$(L,usage_peak_time)',
            'IsEditable': true,
            'IsVisible': false,
            'Mode': 'DateTime',
            'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
            'DateTimeEntryMode': 'datetime',
            'Value': '{DateMaxRead}',
            '_Name': 'PeakUsageTimeControl',
            '_Type': 'Control.Type.FormCell.DatePicker',
        },
        {
            'AllowMultipleSelection': false,
            'Caption': '$(L,note)',
            'IsEditable': true,
            'IsSelectedSectionEnabled': false,
            'Value': '/SAPAssetManager/Rules/Meter/HECO/ZCISReadingNoteValue.js',
            'PickerItems': '/SAPAssetManager/Rules/Meter/Reading/ReadingNoteValues.js',
            '_Name': 'NotePicker',
            '_Type': 'Control.Type.FormCell.ListPicker',
            'IsPickerDismissedOnSelection': true,
            'IsSearchCancelledAfterSelection': true,
        },
        {
            'Caption': '$(L,error_min_max)',
            'IsEditable': false,
            'Value': '{{#Property:MeterReadingLimit_Nav/#Property:ErrorMinLimitChar}} - {{#Property:MeterReadingLimit_Nav/#Property:ErrorMaxLimitChar}}',
            'IsVisible': '/SAPAssetManager/Rules/Meter/Reading/Periodic/ErrorLimitsIsVisible.js',
            '_Name': 'ErrorMinValue',
            '_Type': 'Control.Type.FormCell.SimpleProperty',
        },
        {
            'Title': '$(L,discard)',
            'IsVisible': false,
            'OnPress': {
                'Name': '/SAPAssetManager/Actions/Common/GenericRead.action',
                'Properties': {
                    'Target': {
                        'EntitySet': 'PeriodicMeterReadings',
                        'ReadLink': '#Property:@odata.readLink',
                    },
                    'OnSuccess': '/SAPAssetManager/Rules/Meter/Reading/Periodic/DiscardReading.js',
                },
            },
            '_Name': 'DiscardButton',
            '_Type': 'Control.Type.FormCell.Button',
            'Styles': {
                'Value': 'ObjectCellStyleRed',
            },
        }],
        '_Type': 'Section.Type.FormCell',
    }];

    const pageOverrides = {
        'Title': '$(L, take_readings)',
        'OnLoaded': '/SAPAssetManager/Rules/Meter/Common/HideCancelOnPageLoad.js',
        'ActionBar':
        {
            'Items':
            [{
                'Position': 'left',
                'SystemItem': 'Cancel',
                'OnPress': '/SAPAssetManager/Rules/Common/CheckForChangesBeforeClose.js',
            },
            {
                'Position': 'right',
                'SystemItem': "$(PLT,'Done','')",
                'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                'OnPress': '/SAPAssetManager/Rules/Meter/CreateUpdate/Periodic/DeviceMeterReadingsCreateUpdate.js',
            }],
        },
    };

    //HECO Used for loading previous reading data on dynamic screens
    // CommonLibrary.setStateVariable(context, 'ZDeviceNum', context.binding.BatchEquipmentNum); 
    //HECO End

    const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
    return generator.navToPage();
}
