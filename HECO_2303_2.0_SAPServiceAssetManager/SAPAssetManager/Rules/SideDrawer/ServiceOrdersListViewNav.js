import IsS4SidePanelEnabled from './IsS4SidePanelEnabled';
import WorkOrdersListViewNav from '../WorkOrders/WorkOrdersListViewNav';

export default function ServiceOrdersListViewNav(context) {
    if (IsS4SidePanelEnabled(context)) {
        return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action');
    }

    return WorkOrdersListViewNav(context);
}
