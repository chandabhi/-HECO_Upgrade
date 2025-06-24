/**
* Describe this function...
* @param {IClientAPI} context
*/
import FilterReset from '../Filter/FilterReset';
import phaseFilterReset from '../PhaseModel/PhaseModelFilterPickerReset';
import CommonLibrary from '../Common/Library/CommonLibrary';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';

export default function WorkOrderListFilterReset(context) {
    phaseFilterReset(context, 'PhaseFilter');

    const pageName = context.currentPage.id;
    if (!pageName) return;

    let parentPageName = 'WorkOrdersListViewPage';
    if (pageName === 'ServiceOrderFilterPage') {
        parentPageName = 'ServiceOrdersListViewPage';
    } else if (pageName === 'ServiceItemFilterPage') {
        parentPageName = 'ServiceItemsListViewPage';
    }
    if (pageName === 'ServiceRequestFilterPage') {
        parentPageName = 'ServiceRequestsListViewPage';
    }
    if (pageName === 'ServiceRequestFilterPage') {
        parentPageName = 'ServiceRequestsListViewPage';
    }

    let clientData = context.evaluateTargetPath(`#Page:${parentPageName}/#ClientData`);

    if (clientData && clientData.dueDateSwitch !== undefined) {
        clientData.dueDateSwitch = undefined;
        clientData.dueStartDate = '';
        clientData.dueEndDate = '';
    }
    if (clientData && clientData.reqDateSwitch !== undefined) {
        clientData.reqDateSwitch = undefined;
        clientData.reqStartDate = '';
        clientData.reqEndDate = '';
    }
    if (clientData && clientData.OrderProcessingContext) {
        clientData.OrderProcessingContext = false;
    }
    FilterReset(context);

    // sets back fast filters
    if (pageName === 'ServiceItemFilterPage') {
        let typePicker = CommonLibrary.getControlProxy(context.getPageProxy(), 'TypeLstPicker');
        const filter = S4ServiceLibrary.getServiceItemsFilterCriterias(context.getPageProxy());
        if (filter && filter.length) {
            typePicker.setValue(filter[0].filterItems);
        }
    }
}
