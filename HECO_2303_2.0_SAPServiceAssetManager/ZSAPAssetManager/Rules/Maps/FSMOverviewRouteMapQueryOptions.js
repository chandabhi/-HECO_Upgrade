import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';

export default function FSMOverviewRouteMapQueryOptions(context) {
    const defaultDate = libWO.getActualDate(context);
    return libWO.dateOrdersFilter(context, defaultDate, 'ScheduledStartDate')
        .then(dateFilter => {
            const queryOptions = `$top=1${dateFilter ? '&$filter=' + dateFilter : ''}`;
            return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, queryOptions);
        }).catch(()=>{
            return libWO.attachWorkOrdersFilterByAssgnTypeOrWCM(context, '$top=1');
        });
}
