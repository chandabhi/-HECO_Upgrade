import OperationChangeStatusOptions from '../../../Operations/MobileStatus/OperationChangeStatusOptions';
import pageToolbar from '../../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';

export default function WorkOrderOperationDetailsNav(sectionedTableProxy) {
    let pageProxy = sectionedTableProxy.getPageProxy();
    let previousPageProxy;
    let actionBinding;
    let beforePreviousPageProxy;

    try {
        actionBinding = pageProxy.getActionBinding();
        previousPageProxy = pageProxy.evaluateTargetPathForAPI('#Page:-Previous');
        beforePreviousPageProxy = previousPageProxy.evaluateTargetPathForAPI('#Page:-Previous');
    } catch (err) {
        return generateStatusItemsAndNavigate(pageProxy);
    }

    if (previousPageProxy) {
        if (libCom.getPageName(previousPageProxy) === 'ObjectListViewPage' && libCom.getPageName(beforePreviousPageProxy) === 'WorkOrderOperationDetailsPage') {
            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
            });
        }
    
        if (libCom.getPageName(previousPageProxy) === 'WorkOrderOperationDetailsPage' && previousPageProxy.getBindingObject().OperationNo === actionBinding.OperationNo) {
            return sectionedTableProxy.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
        }
    }

    return generateStatusItemsAndNavigate(pageProxy);
}

function generateStatusItemsAndNavigate(pageProxy) {
    let bindingOriginal = pageProxy.binding;
    pageProxy._context.binding = pageProxy.getActionBinding(); // replace binding with action binding so that we can use OperationChangeStatusOptions before we navigated to the page
    return OperationChangeStatusOptions(pageProxy).then(items => {
        pageProxy._context.binding = bindingOriginal; // revert to original binding 
        return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'WorkOrderOperationDetailsPage').then(() => {
            return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
        });
    }).catch(error => {
        pageProxy._context.binding = bindingOriginal;
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryOperations.global').getValue(), error);
        return pageProxy.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
    });
}
