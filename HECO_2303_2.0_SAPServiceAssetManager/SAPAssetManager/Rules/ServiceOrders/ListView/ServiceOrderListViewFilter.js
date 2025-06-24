import S4ServiceLibrary from '../S4ServiceLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import ServiceOrderListViewCaption from './ServiceOrderListViewCaption';

export default function ServiceOrderListViewFilter(context) {
    let filter = '';

    if (!ValidationLibrary.evalIsEmpty(context.actionResults.filterResult)) {
        filter = context.actionResults.filterResult.data.filter;
    }

    S4ServiceLibrary.setServiceOrdersFilters(context, filter);

    ServiceOrderListViewCaption(context);
}
