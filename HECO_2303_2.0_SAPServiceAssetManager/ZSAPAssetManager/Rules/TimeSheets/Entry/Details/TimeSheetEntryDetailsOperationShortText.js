import {ValueIfExists} from '../../../Common/Library/Formatter';

export default function TimeSheetEntryDetailsOperationShortText(context) {
    let binding = context.binding;

    if (binding.MyWOOperation) {
        if(ValueIfExists(binding.MyWOOperation.OperationShortText)) {
            return binding.MyWOOperation.OperationNo + " - " + binding.MyWOOperation.OperationShortText
        } else {
            return '0';
        }
    } else { //If the nav property doesn't exist (which will happen for non-local entries if the wo is completed) then we show the id
        return ValueIfExists(binding.Operation);
    }
}
