import ZCISIsMeterOrder from "../../Meter/HECO/ZCISIsMeterOrder";
import OffsetODataDate from "../../Common/Date/OffsetODataDate";

export default function ZWorkOrderListViewFootnote(context) {
    //HECO
    //CIS orders show additional date information


    var binding = context.binding;
    if (ZCISIsMeterOrder(context.binding.OrderType)) {
        //HECO special handling for CIS work
        let footnote = "";


        let reqStartDate = new OffsetODataDate(context, context.binding.ZWorkServiceRequiredStartDate);
        let earliestStart = new OffsetODataDate(context, context.binding.ZWorkServiceEarliestStartDate, context.binding.ZWorkServiceEarliestStartTime);
        footnote = 'Req Start: ' +
            context.formatDate(reqStartDate.date(), '', '', { 'format': 'short' }) +
            '    Earliest Start: ' +
            context.formatDatetime(earliestStart.date(), '', '', { 'format': 'short' });

        if (binding.ZWorkCustomerAlertNotes && (binding.ZWorkCustomerAlertNotes.toLowerCase().indexOf("life") != -1)) {
            footnote += '  **LIFE** ';
        }
        if (binding.ZWorkCustomerAlertNotes && (binding.ZWorkCustomerAlertNotes.toLowerCase().indexOf("host") != -1)) {
            footnote += ' **HOSTILE**';
        }
        return footnote;
    } else {
        //Standard SAM code to show due date
        let dueDate = binding.DueDate || binding.DueBy;
        if (libVal.evalIsEmpty(dueDate)) {
            return context.localizeText('no_due_date');
        }

        let odataDate = new OffsetODataDate(context, dueDate);

        if (binding.DueBy) {
            if (binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
                return context.formatDatetime(odataDate.date(), '', '', { 'format': 'short' });
            }
            return context.formatDate(odataDate.date(), '', '', { 'format': 'short' });
        }

        return context.formatDate(odataDate.date());

    }


}
