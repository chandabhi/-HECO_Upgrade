import DetailsPageToolbarClass from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceItemDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();
    let queryOptions = '$select=*,MobileStatus_Nav/*,Category1_Nav/CategoryName,Category2_Nav/CategoryName,Category3_Nav/CategoryName,Category4_Nav/CategoryName&$expand=MobileStatus_Nav,Category1_Nav,Category2_Nav,Category3_Nav,Category4_Nav,Product_Nav,ServiceType_Nav,TransHistories_Nav,TransHistories_Nav/S4ServiceContractItem_Nav/Contract_Nav,ServiceProfile_Nav,AccountingInd_Nav';
       
    return context.read('/SAPAssetManager/Services/AssetManager.service', actionBinding['@odata.readLink'], [], queryOptions).then(function(result) {
        pageProxy.setActionBinding(result.getItem(0));
        return generateToolbarItems(pageProxy).then(() => {
            return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItems/ServiceItemDetailsNav.action');
        });
    });
}

function generateToolbarItems(pageProxy) {
    let bindingOriginal = pageProxy.binding;
    pageProxy._context.binding = pageProxy.getActionBinding(); // replace binding with action binding so that we can get status options before we navigating to the page
    return S4ServiceLibrary.getAvailableStatusesServiceItem(pageProxy).then(items => {
        pageProxy._context.binding = bindingOriginal; // revert to original binding 
        return DetailsPageToolbarClass.getInstance().generatePossibleToolbarItems(pageProxy, items, 'ServiceItemDetailsPage').then(() => {
            return Promise.resolve();
        });
    });
}
