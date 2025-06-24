import { isUserAuthorizedToCreateWO } from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function NotificationCreateWorkOrderVisible(context) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=WorkOrder').then(result => {
        if (result && result.getItem(0)) {
            let notification = result.getItem(0);
            
            return (notification.OrderId || notification.WorkOrder) ? false : isWorkOrderAddToNotificationEnabled(context);
        }
        return false;
    });
}

function isWorkOrderAddToNotificationEnabled(context) {
    return isUserAuthorizedToCreateWO(context) && !PersonaLibrary.isWCMOperator(context);
}
