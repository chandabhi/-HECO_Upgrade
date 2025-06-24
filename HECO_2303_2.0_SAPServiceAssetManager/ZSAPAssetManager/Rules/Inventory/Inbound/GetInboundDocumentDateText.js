import common from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Calculates the text for the status property at the Inbound List screen
 */
 
export default function GetInboundDocumentDateText(clientAPI) {
    var binding = clientAPI.getBindingObject();
    var statusValue = binding.ObjectDate;

    if (binding.IMObject === 'PI') {
        statusValue = binding.PhysicalInventoryDocHeader_Nav.CountDate;
    }

    if (binding.MaterialDocument_Nav) {
        statusValue = binding.MaterialDocument_Nav.DocumentDate;
    }

    if (binding.ProductionOrderHeader_Nav) {
        statusValue = binding.ProductionOrderHeader_Nav.BasicStartDate;
    }

    if (binding.PurchaseOrderHeader_Nav) {
        statusValue = binding.PurchaseOrderHeader_Nav.DocumentDate;
    }

    if (binding.ReservationHeader_Nav) {
        statusValue = binding.ReservationHeader_Nav.ReservationDate;
    }

    if (!libVal.evalIsEmpty(statusValue)) {
        var date = common.dateStringToUTCDatetime(statusValue);
        var dateText = common.getFormattedDate(date, clientAPI);
        return dateText;
    }

    return '';
}
