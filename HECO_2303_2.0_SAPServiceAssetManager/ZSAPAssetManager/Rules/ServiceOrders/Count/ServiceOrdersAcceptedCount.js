import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import libComm from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libVal from '../../Common/Library/ValidationLibrary';
import { OperationLibrary as libOperations } from '../../WorkOrders/Operations/WorkOrderOperationLibrary';

/**
* Getting count of Service Orders or Operations in ACCEPTED status  during a certain day
* @param {IClientAPI} context
*/
export default function ServiceOrdersAcceptedCount(context) {
    const defaultDate = libWO.getActualDate(context);
    const RECEIVED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const TRAVEL = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
    const ONSITE = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
    const ACCEPTED = libComm.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());
    
    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.countOrdersByDateAndStatus(context, [RECEIVED, TRAVEL, ONSITE], defaultDate);
        } else if (MobileStatusLibrary.isServiceItemStatusChangeable(context)) {
            return S4ServiceLibrary.countItemsByDateAndStatus(context, [ACCEPTED, TRAVEL, ONSITE], defaultDate);
        } else {
            return '0';
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
                return WorkOrdersFSMQueryOption(context).then(types => {
                    let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OrderMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OrderMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                    
                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }

                    return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOption));
                });
            });
        } else if (MobileStatusLibrary.isOperationStatusChangeable(context)) {
            return WorkOrderOperationsFSMQueryOption(context).then(types => {
                return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
                    let queryOption = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}' or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                    
                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }
                    
                    return context.count('/SAPAssetManager/Services/AssetManager.service','MyWorkOrderOperations', libOperations.attachOperationsFilterByAssgnTypeOrWCM(context, queryOption));
                });
                
            });
        } else {
            return '0';
        }
    }
}
