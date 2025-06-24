import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in COMPLETED status during the certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersFinishedCount(context) {
    const defaultDate = libWO.getActualDate(context);
    const COMPLETED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
          
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.countOrdersByDateAndStatus(context, [COMPLETED], defaultDate);
        } else if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [COMPLETED], defaultDate);
        } else {
            return '0';
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.statusOrdersCount(context, COMPLETED, defaultDate, 'ScheduledStartDate');
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return libOperations.statusOperationsCount(context, COMPLETED, defaultDate, 'SchedEarliestStartDate');
        } else {
            return '0';
        }
    }
}
