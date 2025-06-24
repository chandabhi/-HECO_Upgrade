import libVal from '../Common/Library/ValidationLibrary';
import OffsetODataDate from '../Common/Date/OffsetODataDate';

export default function GetDateValue(context, dateField, emptyTextKey) {
    const binding = context.binding;
    const date = binding[dateField];
    if (libVal.evalIsEmpty(date)) {
        return emptyTextKey ? context.localizeText(emptyTextKey) : '-';
    }

    let odataDate = new OffsetODataDate(context,date);
    return context.formatDate(odataDate.date());
}
