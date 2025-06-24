import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';

/**
* Getting count of all current day Service Orders
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateFilter(context) {
    const defaultDate = libWO.getActualDate(context);
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue()); 

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.countOrdersByDateAndStatus(context, [RECEIVED, STARTED, COMPLETED, HOLD], defaultDate);
    } else {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                let options = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}'
                or OrderMobileStatus_Nav/MobileStatus eq '${COMPLETED}' or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'
                or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}') and ${dateFilter} and ${types}`;
                return context.count('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, options));
            }); 
        });
    }
}
