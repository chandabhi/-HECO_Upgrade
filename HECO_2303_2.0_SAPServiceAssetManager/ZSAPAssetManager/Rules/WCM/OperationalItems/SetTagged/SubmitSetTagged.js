import IsWCMSignatureEnabled from '../SignatureAttachment/IsWCMSignatureEnabled';
import MobileStatusUpdateOverride from '../../../MobileStatus/MobileStatusUpdateOverride';
import DocumentCreateDelete from '../../../Documents/Create/DocumentCreateDelete';
import CommonLibrary from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import { TagStates } from '../Details/OperationItemToolBarCaption';

export const TaggingStateMap = Object.freeze({
    [TagStates.SetTagged]: SubmitSetTagged,
    [TagStates.SetUntagged]: SubmitSetUntagged,
});

export const ConfirmMessageMap = Object.freeze({
    [TagStates.SetTagged]: 'tag_item_confirmation_text',
    [TagStates.SetUntagged]: 'untag_item_confirmation_text',
});

export const SuccessToastMessageMap = Object.freeze({
    [TagStates.SetTagged]: 'item_tagged_success_message',
    [TagStates.SetUntagged]: 'item_untagged_success_message',
});

export default async function SubmitSetTagged(context) {
    return Promise.all([
        UpdateLockNumber(context),
        UpdateMobileStatusToTagged(context),
        IsWCMSignatureEnabled(context) ? context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SignatureAttachment/SignatureControlCreateSignature.action') : Promise.resolve(),
        CreateAttachments(context),
    ]).catch(error => {
        Logger.error('Set Tagged failed', error);
        throw error;
    });
}

export function SubmitSetUntagged(context) {
    return Promise.all([
        UpdateLockNumber(context),
        UpdateMobileStatusToUntagged(context),
        IsWCMSignatureEnabled(context) ? context.executeAction('/SAPAssetManager/Actions/WCM/OperationalItems/SignatureAttachment/SignatureControlCreateSignature.action') : Promise.resolve(),
    ]).catch(error => {
        Logger.error('Set Unagged failed', error);
        throw error;
    });
}


export function UpdateMobileStatusToTagged(context) {
    return UpdateMobileStatusToStatus(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/TaggedParameterName.global').getValue());
}
export function UpdateMobileStatusToUntagged(context) {
    return UpdateMobileStatusToStatus(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntaggedParameterName.global').getValue());
}

function UpdateMobileStatusToStatus(context, statusName) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WCMDocumentItem.global').getValue();
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=ObjectType eq '${objectType}' and MobileStatus eq '${statusName}'`)
        .then(statusData => context.executeAction(MobileStatusUpdateOverride(context, statusData.getItem(0), 'PMMobileStatus', '')));
}

export function CreateAttachments(context) {
    CommonLibrary.setStateVariable(context, 'skipToastAndClosePageOnDocumentCreate', true);
    DocumentCreateDelete(context);
}

export function UpdateLockNumber(context) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/OperationalItemUpdate.action',
        'Properties': {
            'Properties': {
                'LockNumber': '#Control:LockNumber/#Value',
            },
        },
    });
}

export function SubmitTagConfirmDialog(context, message) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/SetTaggedConfirmDialog.action',
        'Properties': {
            'Message': message,
        },
    }).then(actionResult => {
        if (actionResult.data === false) {
            throw Error('cancelled');
        }
    });
}

export function SubmitTagSuccessToasMessage(context, message) {
    return context.executeAction({
        'Name': '/SAPAssetManager/Actions/WCM/OperationalItems/SetTagged/ItemsSubmittedToast.action',
        'Properties': {
            'Message': message,
        },
    });
}
