import NotificationChangeStatusOptions from '../../../../SAPAssetManager/Rules/Notifications/MobileStatus/NotificationChangeStatusOptions';
import OperationChangeStatusOptions from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationChangeStatusOptions';
import S4ServiceLibrary from '../../../../SAPAssetManager/Rules/ServiceOrders/S4ServiceItemStatusLibrary';
import SubOperationChangeStatusOptions from '../../../../SAPAssetManager/Rules/SubOperations/SubOperationChangeStatusOptions';
import WorkOrderChangeStatusOptions from '../../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';

export default function ToolbarGetStatusOptions(context) {
 let odataType = context.binding['@odata.type'];
    if(context.binding.OrderType&&context.binding.OrderType === "TC01"){
        odataType = '#sap_mobile.MyWorkOrderOperation'
    }
    switch (odataType) { 
        case '#sap_mobile.S4ServiceRequest':
        case '#sap_mobile.S4ServiceOrder':
        case '#sap_mobile.MyWorkOrderHeader':
            return WorkOrderChangeStatusOptions(context);
        case '#sap_mobile.MyWorkOrderOperation':
            return OperationChangeStatusOptions(context,true);
        case '#sap_mobile.MyWorkOrderSubOperation':
            return SubOperationChangeStatusOptions(context);
        case '#sap_mobile.MyNotificationHeader':
            return NotificationChangeStatusOptions(context);
        case '#sap_mobile.S4ServiceItem':
            return S4ServiceLibrary.getAvailableStatusesServiceItem(context);
        default:
            return Promise.resolve([]);
    }
}
