import AttachedDocumentIcon from '../Common/AttachedDocumentIcon';
import { GetApprovalStatus } from '../Common/GetApprovalStatus';
import TrafficLightStatusIcon from '../Common/TrafficLightStatusIcon';

export default function SafetyCertificatesIcons(context) {
    return Promise.all([
        GetApprovalStatus(context),
        GetAttachments(context),
    ]).then(([status, attachments]) => {
        const icons = [TrafficLightStatusIcon(context, status), AttachedDocumentIcon(context, attachments)];
        return icons.filter(x => x !== undefined);
    });
}

function GetAttachments(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMDocumentHeaderAttachments`, [], '$expand=Document');
}
