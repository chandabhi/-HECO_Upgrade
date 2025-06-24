import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import S4OrderRouteQueryOptions from '../ServiceOrders/Map/S4OrderRouteQueryOptions';

export default function S4RouteOverviewMapQueryOptions(context) {
    const defaultDate = libWO.getActualDate(context);

    return S4ServiceLibrary.ordersDateFilter(context, defaultDate)
        .then(dateFilter => {
            return S4OrderRouteQueryOptions(context, dateFilter);
        }).catch(()=>{
            return '$top=1';
        });
}
