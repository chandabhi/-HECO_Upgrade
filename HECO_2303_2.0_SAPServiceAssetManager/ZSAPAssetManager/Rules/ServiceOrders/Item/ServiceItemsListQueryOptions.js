import libCom from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';

/**
* Query options for the list view of Service items
* Build query based on predefined filters or filter query
* reloads list of fast filters when changed
* @param {IClientAPI} clientAPI
*/

export default function ServiceItemsListQueryOptions(clientAPI) {
    let searchString = clientAPI.searchString;
    let expand = '$orderby=ObjectID,ItemNo&$expand=ItemCategory_Nav,ServiceType_Nav,Product_Nav,MobileStatus_Nav,AccountingInd_Nav,TransHistories_Nav/S4ServiceContract_Nav,ServiceProfile_Nav,Document/Document';
    let filters = [];

    if (searchString) {
        let search = [];
        //Standard order filters (required when using a dataQueryBuilder)
        search.push(`substringof('${searchString}', tolower(ItemDesc))`);
        search.push(`substringof('${searchString}', tolower(ItemCategory_Nav/Description))`);
        search.push(`substringof('${searchString}', tolower(ObjectID))`);
        filters.push('(' + search.join(' or ') + ')');
    }

    if (libCom.isDefined(clientAPI.binding) && libCom.isDefined(clientAPI.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        let extraFilter = S4ServiceLibrary.getServiceItemsFilters(clientAPI).slice(8);
        if (extraFilter.trim()) {
            filters.push(extraFilter.trim());
        }
    }

    if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        filters.push(`(ObjectID eq '${clientAPI.binding.ObjectID}')`);
	}

    let query = expand;
    if (filters.length) {
        query += '&$filter=' + filters.join(' and ');
    }

    setCaption(clientAPI, filters.join(' and '));

    return query;
}

function setCaption(clientAPI, queryOptions) {
    let filters = S4ServiceLibrary.getCaptionQuery(clientAPI, 'ServiceItemsListViewPage');
    if (filters) {
        if (queryOptions) {
            queryOptions += ' and (' + filters + ')';
        } else {
            queryOptions = filters;
        }
    }

    if (queryOptions) {
        queryOptions = '$filter=' + queryOptions;
    }

    let totalQueryOptions = '';
    if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        totalQueryOptions = `$filter=ObjectID eq '${clientAPI.binding.ObjectID}'`;
	}

    return S4ServiceLibrary.getListCountCaption(
        clientAPI,
        'S4ServiceItems',
        totalQueryOptions,
        queryOptions,
        'service_order_items_count_x',
        'service_order_items_count_x_x',
    ).then(caption => {
        return clientAPI.getPageProxy().setCaption(caption);
    });
}
