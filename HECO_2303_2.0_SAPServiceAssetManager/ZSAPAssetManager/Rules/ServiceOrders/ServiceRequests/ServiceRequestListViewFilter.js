import S4ServiceLibrary from '../S4ServiceLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ServiceRequestsListViewCaption from './ServiceRequestsListViewCaption';

export default function ServiceRequestListViewFilter(context) {
    let filter = '';

    if (!ValidationLibrary.evalIsEmpty(context.actionResults.filterResult)) {
        filter = context.actionResults.filterResult.data.filter;
    }

    S4ServiceLibrary.setServiceRequestsFilters(context, filter);

    ServiceRequestsListViewCaption(context);
}
