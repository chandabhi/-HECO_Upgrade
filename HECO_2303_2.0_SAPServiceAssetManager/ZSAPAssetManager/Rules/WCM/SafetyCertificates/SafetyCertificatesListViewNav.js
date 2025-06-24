import CachePriorityDescr from '../Common/CachePriorityDescr';

export default function SafetyCertificatesListViewNav(context) {
    CachePriorityDescr(context);
    return context.executeAction('/SAPAssetManager/Actions/WCM/SafetyCertificatesListViewNav.action');
}
