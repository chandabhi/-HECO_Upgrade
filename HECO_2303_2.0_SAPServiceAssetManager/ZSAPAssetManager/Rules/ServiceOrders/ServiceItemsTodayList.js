import { WorkOrderLibrary as libWO } from '../WorkOrders/WorkOrderLibrary';
import S4ServiceLibrary from './S4ServiceLibrary';

/**
* Returning actual query options depending on current date
* filter only by service items, so different types would be ignored
* @param {IClientAPI} context
*/
export default function ServiceItemsTodayList(context) {
    const defaultDate = libWO.getActualDate(context);
    let categoryFilterQuery = S4ServiceLibrary.itemsServiceItemTypesQuery(context);

    return S4ServiceLibrary.itemsDateStatusFilterQuery(context, [], defaultDate, categoryFilterQuery).then(filter => {
        return `${filter}&$expand=S4ServiceOrder_Nav,ItemCategory_Nav,ServiceType_Nav,Product_Nav,MobileStatus_Nav,AccountingInd_Nav,TransHistories_Nav/S4ServiceContract_Nav,ServiceProfile_Nav&$top=3`;
    });
}
