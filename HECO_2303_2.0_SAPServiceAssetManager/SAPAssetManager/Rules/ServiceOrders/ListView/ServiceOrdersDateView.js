import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';

/**
* Switch to ServiceOrdersListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersDateView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDate = libWO.getActualDate(context);
    const COMPLETED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [RECEIVED, STARTED, COMPLETED, HOLD], defaultDate).then(filter => {
            S4ServiceLibrary.setServiceOrdersFilters(context, filter);
            return S4ServiceLibrary.isAnythingStarted(context).then(() => {   
                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                    SetPredefinedOrdersListFilters(context, '', defaultDate);
                });
            });
        });
    } else {
        return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
            return WorkOrdersFSMQueryOption(context).then(types => {
                const filter = `$expand=OrderMobileStatus_Nav,WOPriority&$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}'
                or OrderMobileStatus_Nav/MobileStatus eq '${COMPLETED}' or OrderMobileStatus_Nav/MobileStatus eq '${STARTED}'
                or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}') and ${dateFilter} and ${types}`;
                libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
                return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, '', defaultDate);
                    });
                });
            });
        });
    }
}
