import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';

export default function ServiceRequestDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    let queryOptions = '$select=*,MobileStatus_Nav/*&$expand=MobileStatus_Nav,RefObj_Nav/MyEquipment_Nav,RefObj_Nav/MyFunctionalLocation_Nav';
       
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceRequestsDetailsNav.action');
        });
    });
}

function generateToolbarItems(pageProxy) {
    if (MobileStatusLibrary.isServiceOrderStatusChangeable(pageProxy)) {
        let bindingOriginal = pageProxy.binding;
        pageProxy._context.binding = pageProxy.getActionBinding(); // replace binding with action binding so that we can use WorkOrderChangeStatusOptions before we navigated to the page
        return WorkOrderChangeStatusOptions(pageProxy).then(items => {
            pageProxy._context.binding = bindingOriginal; // revert to original binding 
            return DetailsPageToolbarClass.getInstance().generatePossibleToolbarItems(pageProxy, items, 'ServiceRequestDetailsPage').then(() => {
                return Promise.resolve();
            });
        });
    } else {
        return Promise.resolve();
    }
}
