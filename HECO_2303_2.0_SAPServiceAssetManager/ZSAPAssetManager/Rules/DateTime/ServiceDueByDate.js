import CommonLibrary from '../Common/Library/CommonLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';
import S4ServiceLibrary from '../ServiceOrders/S4ServiceLibrary';
/**
* Getting time period of SO from binding and making it in correct format
* @param {IClientAPI} context
*/
export default function ServiceDueByDate(context) {
    let binding = context.binding;
    let dateString = '';

    if (CommonLibrary.isDefined(binding)) {
        let dueDate = binding.DueBy;

        if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
            if (!S4ServiceLibrary.checkIfItemIsServiceItem(context, binding)) {
                dueDate = undefined;
                dateString = context.formatCurrency(binding.NetValue, binding.Currency, '',  {'maximumFractionDigits': 1, 'useGrouping': true});
            }
        }
        
        if (CommonLibrary.isDefined(dueDate)) {
            let startOdataDate = new OffsetODataDate(context, dueDate);
            dateString = context.formatDate(startOdataDate.date(), '', '', {'format': 'short'});
        } else {
            return context.localizeText('no_due_date');
        }
    }

    return dateString;
}
