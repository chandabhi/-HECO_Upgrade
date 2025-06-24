import { WorkOrderLibrary as libWO } from '../../WorkOrders/WorkOrderLibrary';

export default function FSMWorkOrderFilterQueryOptions(context) {
    var filter = '$orderby=OrderId&$filter=sap.entityexists(Operations/FSMFormInstance_Nav)';
    if (context.binding && context.binding.OrderId) {
        filter += "&$filter=OrderId eq '" + context.binding.OrderId + "'";
    }
    return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, filter);
}
