import AttachedDocumentIcon from '../../Common/AttachedDocumentIcon';

export default function WorkApprovalsIcons(context) {
    return GetAttachments(context).then(attachments => {
        const attachmentIcon = AttachedDocumentIcon(context, attachments);
        return attachmentIcon ? [attachmentIcon] : [];
    });
}

function GetAttachments(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMApprovalAttachments`, [], '$expand=Document');
}
