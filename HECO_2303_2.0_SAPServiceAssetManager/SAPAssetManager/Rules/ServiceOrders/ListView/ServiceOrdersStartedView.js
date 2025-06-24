import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import libVal from '../../Common/Library/ValidationLibrary';

/**
* Switch to ServiceOrdersListViewNav or ServiceItemsListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersStartedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDate = libWO.getActualDate(context);
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [STARTED, HOLD], defaultDate).then(filter => {
                S4ServiceLibrary.setServiceOrdersFilters(context, filter);

                return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, [STARTED, HOLD], defaultDate);
                    });
                });
            });
        } else {
            return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [STARTED, HOLD], defaultDate).then(filter => {
                S4ServiceLibrary.setServiceItemsFilters(context, filter);
            
                return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, [STARTED, HOLD], defaultDate);
                    });
                });
            });
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return WorkOrdersFSMQueryOption(context).then(types => {
                return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
                    let filter = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${STARTED}' or OrderMobileStatus_Nav/MobileStatus eq '${HOLD}') and ${dateFilter}`;
                
                    if (!libVal.evalIsEmpty(types)) {
                        filter += ' and ' + types;
                    }
    
                    libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
                    return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                            SetPredefinedOrdersListFilters(context, [STARTED, HOLD], defaultDate);
                        });  
                    });
                });
            });
        } else {
            return WorkOrderOperationsFSMQueryOption(context).then(types => {
                return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
                    let filter = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${STARTED}' or OperationMobileStatus_Nav/MobileStatus eq '${HOLD}') and ${dateFilter}`;
                
                    if (!libVal.evalIsEmpty(types)) {
                        filter += ' and ' + types;
                    }
                    
                    libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
                    return libOpMobile.isAnyOperationStarted(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                            SetPredefinedItemsListFilters(context, [STARTED, HOLD], defaultDate);
                        });
                    });
                });
            });
        }
    }
}
