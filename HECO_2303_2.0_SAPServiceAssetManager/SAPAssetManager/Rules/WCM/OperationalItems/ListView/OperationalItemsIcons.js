import AttachedDocumentIcon from '../../Common/AttachedDocumentIcon';
import Logger from '../../../Log/Logger';
import { OpItemMobileStatusCodes } from '../libWCMDocumentItem';
import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function OperationalItemsIcons(context) {
    const icons = [];

    if (ShowLockTaggedIcon(context.binding)) {
        icons.push('/SAPAssetManager/Images/locktagged.pdf');
    } else if (ShowLockUntaggedIcon(context.binding)) {
        icons.push('/SAPAssetManager/Images/lockuntagged.pdf');
    }

    return GetAttachments(context)
        .then(attachments => {
            const attachmentIcon = AttachedDocumentIcon(context, attachments);
            if (attachmentIcon) {
                icons.push(attachmentIcon);
            }
            return icons;
        })
        .catch((error) => {
            Logger.error(`Cannot read WCMDocumentItemAttachments for Operational Item ${context.binding['@odata.readLink']}`, error);
            return icons;
        });
}

function GetAttachments(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMDocumentItemAttachments`, [], '$expand=Document');
}

function ShowLockTaggedIcon(wcmDocumentItem) {
    if (ValidationLibrary.evalIsEmpty(wcmDocumentItem.PMMobileStatus)) {
        return false;
    }
    const mobileStatus = wcmDocumentItem.PMMobileStatus.MobileStatus;
    return mobileStatus === OpItemMobileStatusCodes.Tagged || mobileStatus === OpItemMobileStatusCodes.Untag;
}

function ShowLockUntaggedIcon(wcmDocumentItem) {
    return wcmDocumentItem.PMMobileStatus && wcmDocumentItem.PMMobileStatus.MobileStatus === OpItemMobileStatusCodes.UnTagged;
}
