import libCom from '../../Common/Library/CommonLibrary';
import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import SetPredefinedOrdersListFilters from './SetPredefinedOrdersListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import libWOMobile from '../../WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import {OperationLibrary as libOperations} from '../../WorkOrders/Operations/WorkOrderOperationLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';

/**
* Switch to ServiceOrdersListViewNav or ServiceItemsListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceOrdersReceivedView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDate = libWO.getActualDate(context);
    const RECEIVED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReceivedParameterName.global').getValue());

    if (IsS4ServiceIntegrationEnabled(context)) {
        if (MobileStatusLibrary.isServiceOrderStatusChangeable(context)) {
            S4ServiceLibrary.ordersDateStatusFilterQuery(context, [RECEIVED], defaultDate).then(filter => {
                S4ServiceLibrary.setServiceOrdersFilters(context, filter);

                return S4ServiceLibrary.isAnythingStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceOrdersListViewNav.action').then(() => {
                        SetPredefinedOrdersListFilters(context, [RECEIVED], defaultDate);
                    });
                });
            });
        } else {
            return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [RECEIVED], defaultDate).then(filter => {
                S4ServiceLibrary.setServiceItemsFilters(context, filter);

                return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, [RECEIVED], defaultDate);
                    });
                });
            });
        }
    } else {
        if (MobileStatusLibrary.isHeaderStatusChangeable(context)) {
            const filter = libWO.statusOrdersFilter(context, RECEIVED, defaultDate, 'ScheduledStartDate');
            libCom.setStateVariable(context, 'WORKORDER_FILTER', filter);
            return libWOMobile.isAnyWorkOrderStarted(context).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrdersListViewNav.action').then(() => {
                    SetPredefinedOrdersListFilters(context, RECEIVED, defaultDate);
                });  
            });
        } else {
            return libOperations.statusOperationFilter(context, RECEIVED, defaultDate, 'SchedEarliestStartDate').then(filter => {
                libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
                return libOpMobile.isAnyOperationStarted(context).then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                        SetPredefinedItemsListFilters(context, RECEIVED, defaultDate);
                    });
                });
            });
        }
    }
}
