import WorkOrderDetailsNav from '../WorkOrders/WorkOrderDetailsNav.js';
import libCommon from '../Common/Library/CommonLibrary.js';

export default function ZOmniWorkOrderDetailsNav(context, orderId)
{
    let pageProxy = context.getPageProxy();
    // let queryOptions = '$select=*,WOPartners/PartnerFunction,FunctionalLocation/FuncLocDesc,OrderMobileStatus_Nav/*&$expand=WODocuments,OrderMobileStatus_Nav,FunctionalLocation,Operations,Operations/SubOperations,WOGeometries/Geometry,MarkedJob,Confirmations,UserTimeEntry_Nav,WOObjectList_Nav,WOPartners/Address_Nav/AddressGeocode_Nav/Geometry_Nav,Address/AddressGeocode_Nav/Geometry_Nav,Equipment/Address/AddressGeocode_Nav/Geometry_Nav';

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], `$expand=Operations/OperationLongText,OrderMobileStatus_Nav,UserTimeEntry_Nav,Equipment,FunctionalLocation,HeaderLongText,WODocuments,WOGeometries/Geometry,MarkedJob&$filter=OrderId eq '${orderId}'`).then(function (result)
    {
        // pageProxy.setActionBinding(result.getItem(0));
        libCommon.setStateVariable(context, 'BINDINGOBJECT', result.getItem(0));
        WorkOrderDetailsNav(context);
    });
}
