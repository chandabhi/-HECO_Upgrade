import CommonLibrary from "../../Common/Library/CommonLibrary";
import { DynamicPageGenerator } from "../../FDC/DynamicPageGenerator";

export default function ZCISHoldStatusUpdate(context) {
    const sectionData =
    [{
        'Controls': [
            {
                'AllowMultipleSelection': false,
                'Caption': '$(L,status)',
                'PickerItems': '/SAPAssetManager/Rules/Meter/HECO/ZCISHoldNumberedStatusValues.js',
                '_Name': 'StatusPicker',
                '_Type': 'Control.Type.FormCell.ListPicker',
                'IsPickerDismissedOnSelection': true
            },
            {
                'AllowMultipleSelection': false,
                'Caption': '$(L,zcomplementary_status)',
                'PickerItems': '/SAPAssetManager/Rules/Meter/HECO/ZCISHoldUnnumberedStatusValues.js',
                '_Name': 'ComplementaryStatusPicker',
                '_Type': 'Control.Type.FormCell.ListPicker',
                'IsPickerDismissedOnSelection': true,
            },
            //Adding Notes field
                {
                'Caption': '$(L, note)',
                'PlaceHolder': '$(L,note)',
                '_Name': 'LongTextNote',
                '_Type': 'Control.Type.FormCell.SimpleProperty',
                'Value': '{Comments}',
                'IsEditable': '/SAPAssetManager/Rules/Checklists/ChecklistUpdateAllowChecklistEdit.js',
                'OnValueChange': '/SAPAssetManager/Rules/Common/Validation/ResetValidationOnInput.js',
                }
        ],
        '_Type': 'Section.Type.FormCell',
    }];

    const pageOverrides = {
        'Caption': '$(L,zupdate_hold_status)',
        'ActionBar':
        {
            'Items':
            [{
                'Position': 'left',
                'SystemItem': 'Cancel',
                'OnPress': '/SAPAssetManager/Actions/Page/CancelPage.action',
            },
            {
                'Position': 'right',
                'SystemItem': "$(PLT,'Done','')",
                'Text': '/SAPAssetManager/Rules/Common/Platform/DoneText.js',
                'OnPress': '/SAPAssetManager/Rules/Meter/HECO/ZCISHoldStatusSave.js',
            }],
        },
    };

    let binding = context.binding;
    const generator = new DynamicPageGenerator(context, null, sectionData, pageOverrides);
    return generator.navToPage();

}
