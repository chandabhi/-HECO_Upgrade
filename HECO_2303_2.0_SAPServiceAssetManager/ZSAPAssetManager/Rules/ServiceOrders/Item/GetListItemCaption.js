import S4ServiceLibrary from '../S4ServiceLibrary';

export default function GetListItemCaption(context) {
    let filterCriterias = S4ServiceLibrary.getServiceItemsFilterCriterias(context);
    let filters = [];

    if (filterCriterias && filterCriterias.length) {
        let table = context.evaluateTargetPath('#Page:ServiceItemsListViewPage/#Control:SectionedTable');
        let existingFilters;
        if (table) {
            existingFilters = table.getFilters();
        }

        if (!existingFilters) {
            filters.push(filterCriterias[0].filterItems[0]);
        }
    }

    if (context.binding && context.binding.isInitialFilterNeeded) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        let extraFilter = S4ServiceLibrary.getServiceItemsFilters(context).slice(8);
        if (extraFilter.trim()) {
            filters.push(extraFilter.trim());
        }
    }

    let totalQueryOptions = '';
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        totalQueryOptions = `$filter=ObjectID eq '${context.binding.ObjectID}'`;
        filters.push(`ObjectID eq '${context.binding.ObjectID}'`);
	}

    let queryOptions = '';
    if (filters.length) {
        queryOptions = '$filter=' + filters.join(' and ');
    }

    return S4ServiceLibrary.getListCountCaption(
        context,
        'S4ServiceItems',
        totalQueryOptions,
        queryOptions,
        'service_order_items_count_x',
        'service_order_items_count_x_x',
    ).then(caption => {
        return context.getPageProxy().setCaption(caption);
    });
}
