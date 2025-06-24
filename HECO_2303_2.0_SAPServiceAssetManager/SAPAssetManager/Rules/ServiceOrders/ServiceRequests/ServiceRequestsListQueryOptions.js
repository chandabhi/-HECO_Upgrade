import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceRequestsListQueryOptions(context) {
    let queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('Priority_Nav,MobileStatus_Nav,RefObj_Nav,RefObj_Nav/MyFunctionalLocation_Nav,RefObj_Nav/MyEquipment_Nav,Document/Document');
    queryBuilder.orderBy('ObjectID,Description,DueBy');

    let searchString = context.searchString;
    if (searchString) {
        let filters = [];
        //Standard order filters (required when using a dataQueryBuilder)
        filters.push(`substringof('${searchString}', tolower(ObjectID))`);
        filters.push(`substringof('${searchString}', tolower(Priority_Nav/Description))`);
        filters.push(`substringof('${searchString}', tolower(Description))`);
        queryBuilder.filter('(' + filters.join(' or ') + ')');
    }

    if (CommonLibrary.isDefined(context.binding) && CommonLibrary.isDefined(context.binding.isInitialFilterNeeded)) {
        // getting filter values from state variable - slice(8) is need to remove '$filter='
        queryBuilder.filter(S4ServiceLibrary.getServiceRequestsFilters(context).slice(8));
    }

    return queryBuilder;
}
