import AttachedDocumentIcon from '../Common/AttachedDocumentIcon';
import TrafficLightStatusIcon from '../Common/TrafficLightStatusIcon';
import { GetApprovalStatus } from '../Common/GetApprovalStatus';

export default function WorkPermitIcons(context) {
    return Promise.all([
        GetApprovalStatus(context),
        GetAttachments(context),
    ]).then(([status, attachments]) => {
        const icons = [TrafficLightStatusIcon(context, status), AttachedDocumentIcon(context, attachments)];
        return icons.filter(x => x !== undefined);
    });
}

function GetAttachments(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMApplicationAttachments`, [], '$expand=Document');
}
