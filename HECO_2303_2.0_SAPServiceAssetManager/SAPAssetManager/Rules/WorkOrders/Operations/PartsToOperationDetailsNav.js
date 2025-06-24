import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCom from '../../Common/Library/CommonLibrary';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';

export default function PartsToOperationDetailsNav(context) {
    let previousPage = context.evaluateTargetPathForAPI('#Page:-Previous');
    if (libCom.getPageName(previousPage) === 'PartsListViewPage') {
        let partsListViewPreviousPage = previousPage.evaluateTargetPathForAPI('#page:-Previous');
        if (libCom.getPageName(partsListViewPreviousPage) === 'WorkOrderOperationDetailsPage') {
            return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
    }

    let bindingOriginal = context.binding;
    context._context.binding = context.getPageProxy().getActionBinding(); // replace binding with action binding so that we can use OperationChangeStatusOptions before we navigated to the page
    return OperationChangeStatusOptions(context).then(items => {
        context._context.binding = bindingOriginal; // revert to original binding 
        return pageToolbar.getInstance().generatePossibleToolbarItems(context, items, 'WorkOrderOperationDetailsPage').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
        });
    });
}
