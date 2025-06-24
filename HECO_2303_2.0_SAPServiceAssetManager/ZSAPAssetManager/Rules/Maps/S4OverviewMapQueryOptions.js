import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
import S4MapQueryOptions from './S4MapQueryOptions';

export default function S4OverviewMapQueryOptions(context) {
    const defaultDate = libWO.getActualDate(context);

    return S4ServiceLibrary.ordersDateFilter(context, defaultDate)
        .then(dateFilter => {
            return S4MapQueryOptions(context, dateFilter);
        }).catch(()=>{
            return '$top=1';
        });
}
