import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import IsS4ServiceIntegrationEnabled from './IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import CommonLibrary from '../Common/Library/CommonLibrary';

/**
* Returning actual query options depending on current date
* @param {IClientAPI} context
*/
export default function WorkOrderTodayList(context) {
    const defaultDate = libWO.getActualDate(context);
    const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const RECEIVED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const HOLD = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const STARTED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        return Promise.resolve('$top=2');
    } else {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                const queryOptions = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}'
                or OrderMobileStatus_Nav/MobileStatus eq '${COMPLETED}' or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'
                or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}') and ${dateFilter} and ${types}&$top=2`;
                return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
            });
        });
    }
}
