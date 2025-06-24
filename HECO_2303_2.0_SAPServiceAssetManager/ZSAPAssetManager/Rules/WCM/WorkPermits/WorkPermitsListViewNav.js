
import CachePriorityDescr from '../Common/CachePriorityDescr';

export default function WorkPermitsListViewNav(context) {
    CachePriorityDescr(context);
    return context.executeAction('/SAPAssetManager/Actions/WCM/WorkPermitsListViewNav.action');
}
