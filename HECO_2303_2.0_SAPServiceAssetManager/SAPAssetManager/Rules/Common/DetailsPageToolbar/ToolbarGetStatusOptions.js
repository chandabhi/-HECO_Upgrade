import NotificationChangeStatusOptions from '../../Notifications/MobileStatus/NotificationChangeStatusOptions';
import OperationChangeStatusOptions from '../../Operations/MobileStatus/OperationChangeStatusOptions';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import SubOperationChangeStatusOptions from '../../SubOperations/SubOperationChangeStatusOptions';
import WorkOrderChangeStatusOptions from '../../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';

export default function ToolbarGetStatusOptions(context) {
    switch (context.binding['@odata.type']) { 
        case '#sap_mobile.S4ServiceRequest':
        case '#sap_mobile.S4ServiceOrder':
        case '#sap_mobile.MyWorkOrderHeader':
            return WorkOrderChangeStatusOptions(context);
        case '#sap_mobile.MyWorkOrderOperation':
            return OperationChangeStatusOptions(context);
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
