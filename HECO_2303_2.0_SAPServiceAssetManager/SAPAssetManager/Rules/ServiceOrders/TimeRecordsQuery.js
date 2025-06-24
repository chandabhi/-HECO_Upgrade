import ODataDate from '../Common/Date/ODataDate';
import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
/**
* Returning actual query options for time records depending on current date
* @param {IClientAPI} context
*/
export default function TimeRecordsQuery(context) {
    const defaultDate = libWO.getActualDate(context);
    let oDataDate = new ODataDate(defaultDate);
    let dateQuery = oDataDate.queryString(context, 'date');
    let dateFilter = `PostingDate eq ${dateQuery}`;
    return `$filter=${dateFilter}&$orderby=PostingDate desc&$top=2`;
}
