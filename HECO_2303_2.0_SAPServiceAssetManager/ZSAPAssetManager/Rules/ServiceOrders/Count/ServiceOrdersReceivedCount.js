import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in RECEIVED status during a certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersReceivedCount(context) {
    const defaultDate = libWO.getActualDate(context);
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [RECEIVED], defaultDate);
        } else {
            return '0';
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.statusOrdersCount(context, RECEIVED, defaultDate, 'ScheduledStartDate');
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return libOperations.statusOperationsCount(context, RECEIVED, defaultDate, 'SchedEarliestStartDate');
        } else {
            return '0';
        }
    }
}
