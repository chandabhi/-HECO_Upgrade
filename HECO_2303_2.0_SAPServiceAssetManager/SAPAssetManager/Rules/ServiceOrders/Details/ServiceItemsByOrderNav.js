import CommonLibrary from '../../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceItemsByOrderNav(context) {
    CommonLibrary.setStateVariable(context, 'SERVICEITEMS_FILTER', '');
    S4ServiceLibrary.setServiceItemsFilterCriterias(context, []);
    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItemsListViewNav.action');
}
