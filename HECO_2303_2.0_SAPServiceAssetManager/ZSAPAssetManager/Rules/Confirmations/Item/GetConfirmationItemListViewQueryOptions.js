import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Query options for confirmation item list view screen
* @param {IClientAPI} context
*/
export default function GetConfirmationItemListViewQueryOptions(context) {
    let searchString = context.searchString;
    let filters = [];
    let expand = '$expand=S4ServiceConfirmation_Nav,MobileStatus_Nav';

    if (searchString) {
        let search = [];
        //Standard order filters (required when using a dataQueryBuilder)
        search.push(`substringof('${searchString}', tolower(ItemDesc))`);
        search.push(`substringof('${searchString}', tolower(ObjectID))`);
        search.push(`substringof('${searchString}', tolower(ItemCategory))`);
        filters.push('(' + search.join(' or ') + ')');
    }

    if (libCom.isDefined(context.binding) && libCom.isDefined(context.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        let extraFilter = S4ServiceLibrary.getConfirmationItemFilters(context).slice(8);
        if (extraFilter.trim()) {
            filters.push(extraFilter.trim());
        }
    }

    let query = expand;
    if (filters.length) {
        query += '&$filter=' + filters.join(' and ');
    }

    return query;
}
