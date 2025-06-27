import {ValueIfExists} from '../../../../../SAPAssetManager/Rules/Common/Library/Formatter';

export default function TimeSheetEntryDetailsOrderDescription(context) {
    let binding = context.binding;

    if (binding.MyWOHeader) {
        if (ValueIfExists(binding.MyWOHeader.OrderDescription)) {
            return binding.MyWOHeader.OrderId + " - " + binding.MyWOHeader.OrderDescription;
        } else {
            return '-';
        }
    } else { //If the nav property doesn't exist (which will happen for non-local entries if the wo is completed) then we show the id
        return ValueIfExists(binding.RecOrder);
    }
}
