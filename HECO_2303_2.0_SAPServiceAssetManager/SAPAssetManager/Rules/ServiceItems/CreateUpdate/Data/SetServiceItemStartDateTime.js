import OffsetODataDate from '../../../Common/Date/OffsetODataDate';
import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function SetServiceItemStartDateTime(context) {
    if (!CommonLibrary.IsOnCreate(context) && context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        let odataDate = new OffsetODataDate(context, context.binding.RequestedStart);
        return odataDate.date();
    }

    return new Date();
}
