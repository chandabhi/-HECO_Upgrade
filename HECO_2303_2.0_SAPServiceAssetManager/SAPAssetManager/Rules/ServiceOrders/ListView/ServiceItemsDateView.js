import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';
import SetPredefinedItemsListFilters from './SetPredefinedItemsListFilters';
import S4ServiceLibrary from '../S4ServiceLibrary';
import libOpMobile from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Switch to WorkOrdersListViewNav with initial filter values
* @param {IClientAPI} context
*/
export default function ServiceItemsDateView(context) {
    let actionBinding = {
        isInitialFilterNeeded: true,
    };
    context.getPageProxy().setActionBinding(actionBinding);

    const defaultDate = libWO.getActualDate(context);

    if (IsS4ServiceIntegrationEnabled(context)) {
        let categoryFilterQuery = S4ServiceLibrary.itemsServiceItemTypesQuery(context);
        return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [], defaultDate, categoryFilterQuery).then(filter => {
            S4ServiceLibrary.setServiceItemsFilters(context, filter);
            return S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted').then(() => {
                return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action').then(() => {
                    SetPredefinedItemsListFilters(context, '', defaultDate);
                });
            });
        });
    } else {
        return libWO.dateOperationsFilter(context, defaultDate, 'SchedEarliestStartDate').then(dateFilter => {
            const filter = `$filter=${dateFilter}`;
            libCom.setStateVariable(context, 'OPERATIONS_FILTER', {entity: 'MyWorkOrderOperations', query: filter, localizeTextX: 'operations_x', localizeTextXX: 'operations_x_x'});
            return libOpMobile.isAnyOperationStarted(context).then(() => {
                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationsListViewNav.action').then(() => {
                    SetPredefinedItemsListFilters(context, '', defaultDate);
                });
            });
        });
    }
}
