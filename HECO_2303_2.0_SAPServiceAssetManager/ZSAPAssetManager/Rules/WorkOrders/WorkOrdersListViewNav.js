import libCom from '../Common/Library/CommonLibrary';
import WOMobileLib from './MobileStatus/WorkOrderMobileStatusLibrary';

export default function WorkOrdersListViewNav(context) {
    //OMNI Clear binding used by Omni and swipe
    libCom.clearStateVariable(context,'BINDINGOBJECT');
    context.getPageProxy()._context.binding = undefined;
    context._context.binding = undefined;
    //OMNI End
    libCom.setStateVariable(context, 'WorkOrderListFilter', 'ALL_JOBS');
    libCom.setStateVariable(context, 'WORKORDER_FILTER', '$filter=');
    libCom.setStateVariable(context,'FromOperationsList', false);
    return WOMobileLib.isAnyWorkOrderStarted(context).then(() => {
        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action');
    });
}
