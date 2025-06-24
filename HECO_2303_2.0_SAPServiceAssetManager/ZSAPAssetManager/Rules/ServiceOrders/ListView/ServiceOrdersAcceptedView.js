import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import WorkOrdersFSMQueryOption from '../../WorkOrders/ListView/WorkOrdersFSMQueryOption';
import WorkOrderOperationsFSMQueryOption from '../../WorkOrders/Operations/WorkOrderOperationsFSMQueryOption';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import liWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
* Switch to ServiceOrdersListViewNav or ServiceItemsListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersAcceptedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDate = libWO.getActualDate(context);
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());
    const TRAVEL = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TravelParameterName.global').getValue());
    const ONSITE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/OnsiteParameterName.global').getValue());
    const ACCEPTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/AcceptedParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            return S4ServiceLibrary.ordersDateStatusFilterQuery(context, [RECEIVED, TRAVEL, ONSITE], defaultDate).then(filter => {
                S4ServiceLibrary.setServiceOrdersFilters(context, filter);

                return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, [RECEIVED, TRAVEL, ONSITE], defaultDate);
                    });
                });
            });
        } else {
            return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [ACCEPTED, TRAVEL, ONSITE], defaultDate).then(filter => {
                S4ServiceLibrary.setServiceItemsFilters(context, filter);

                return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, [ACCEPTED, TRAVEL, ONSITE], defaultDate);
                    });
                });
            });
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate').then(dateFilter => {
                return WorkOrdersFSMQueryOption(context).then(types => {
                    let queryOption = `$filter=(OrderMobileStatus_Nav/MobileStatus eq '${RECEIVED}' or OrderMobileStatus_Nav/MobileStatus eq '${TRAVEL}' or OrderMobileStatus_Nav/MobileStatus eq '${ONSITE}') and ${dateFilter}`;
                    
                    if (!libVal.evalIsEmpty(types)) {
                        queryOption += ' and ' + types;
                    }
        
                    libCom.setStateVariable(context, 'WORKORDER_FILTER', queryOption);
                    return liWOMobile.isAnyWorkOrderStarted(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                            SetPredefinedOrdersListFilters(context, [RECEIVED, TRAVEL, ONSITE], defaultDate);
                        });  
                    });
                });
            });
        } else {
            return WorkOrderOperationsFSMQueryOption(context).then(types => {
                return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
                    let filter = `$filter=(OperationMobileStatus_Nav/MobileStatus eq '${ACCEPTED}'
                        or OperationMobileStatus_Nav/MobileStatus eq '${TRAVEL}'
                        or OperationMobileStatus_Nav/MobileStatus eq '${ONSITE}')
                        and ${dateFilter}`;
    
                    if (!libVal.evalIsEmpty(types)) {
                        filter += ' and ' + types;
                    }
                    
                    libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
                    return libOpMobile.isAnyOperationStarted(context).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                            SetPredefinedItemsListFilters(context, [ACCEPTED, TRAVEL, ONSITE], defaultDate);
                        });
                    });
                });
            });
        }
    }
}
