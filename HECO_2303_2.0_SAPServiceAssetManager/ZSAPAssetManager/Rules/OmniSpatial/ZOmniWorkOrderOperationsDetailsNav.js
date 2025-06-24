import WorkOrderOperationDetailsNav from '../WorkOrders/Operations/Details/WorkOrderOperationDetailsNav.js';

export default function ZOmniWorkOrderOperationsDetailsNav(context, orderId)
{
    let pageProxy = context.getPageProxy();
    // let queryOptions = '$select=*,WOPartners/PartnerFunction,FunctionalLocation/FuncLocDesc,OrderMobileStatus_Nav/*&$expand=WODocuments,OrderMobileStatus_Nav,FunctionalLocation,Operations,Operations/SubOperations,WOGeometries/Geometry,MarkedJob,Confirmations,UserTimeEntry_Nav,WOObjectList_Nav,WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav';

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], `$expand=WOHeader,OperationMobileStatus_Nav&$filter=OrderId eq '${orderId}'`).then(function (result)
    {
        pageProxy.setActionBinding(result.getItem(0));
        // WorkOrderDetailsNav(context);
        WorkOrderOperationDetailsNav(context);
    });
}
