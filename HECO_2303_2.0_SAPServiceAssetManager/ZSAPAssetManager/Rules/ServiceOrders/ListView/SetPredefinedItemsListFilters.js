import ODataDate from '../../Common/Date/ODataDate';
import IsS4ServiceIntegrationEnabled from '../IsS4ServiceIntegrationEnabled';

export default function SetPredefinedItemsListFilters(context, status, defaultDate) {
    if (IsS4ServiceIntegrationEnabled(context)) { 
        let clientData = context.evaluateTargetPath('#Page:ServiceItemsListViewPage/#ClientData');

        if (clientData) {
            clientData.scheduledEarliestStartDateSwitch = true;
            clientData.scheduledEarliestStartDateStart = new ODataDate(defaultDate).toLocalDateString();
            clientData.scheduledEarliestStartDateEnd = new ODataDate(defaultDate).toLocalDateString();
            clientData.predefinedStatus = status;
        }
    } else {
        let clientData = context.evaluateTargetPath('#Page:WorkOrdersListViewPage/#ClientData');

        clientData.reqDateSwitch = true;
        clientData.reqStartDate = new ODataDate(defaultDate).toLocalDateString();
        clientData.reqEndDate = new ODataDate(defaultDate).toLocalDateString();
        clientData.predefinedStatus = status;
    }
}
