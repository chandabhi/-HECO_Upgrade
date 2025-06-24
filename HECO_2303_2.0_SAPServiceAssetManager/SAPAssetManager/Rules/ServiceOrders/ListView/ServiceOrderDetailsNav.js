import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';

export default function ServiceOrderDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    let expand = '$expand=MobileStatus_Nav,TransHistories_Nav/S4ServiceContract_Nav,RefObjects_Nav/Material_Nav,' + 
        'Partners_Nav/BusinessPartner_Nav/Address_Nav/AddressGeocode_Nav/Geometry_Nav,' +
        'Partners_Nav/S4PartnerFunc_Nav,'+
        'RefObjects_Nav/Equipment_Nav/Address/AddressGeocode_Nav/Geometry_Nav,' + 
        'RefObjects_Nav/FuncLoc_Nav/Address/AddressGeocode_Nav/Geometry_Nav';
    let queryOptions = '$select=*,MobileStatus_Nav/*&' + expand;

    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrderDetailsNav.action');
        });
    });
}

function generateToolbarItems(pageProxy) {
    if (MobileStatusLibrary.isServiceOrderStatusChangeable(pageProxy)) {
        let bindingOriginal = pageProxy.binding;
        pageProxy._context.binding = pageProxy.getActionBinding(); // replace binding with action binding so that we can use WorkOrderChangeStatusOptions before we navigated to the page
        return WorkOrderChangeStatusOptions(pageProxy).then(items => {
            pageProxy._context.binding = bindingOriginal; // revert to original binding 
            return DetailsPageToolbarClass.getInstance().generatePossibleToolbarItems(pageProxy, items, 'ServiceOrderDetailsPage').then(() => {
                return Promise.resolve();
            });
        });
    } else {
        return Promise.resolve();
    }
}
