import CommonLibrary from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';

export default function LengthValidation(context, control, length_field) {

    if (!length_field) {
        let message = context.localizeText('field_is_required');
        CommonLibrary.executeInlineControlError(context, control, message);
    } else {
        if (libLocal.toNumber(context, length_field) <= 0) {
            let message = context.localizeText('positive_length');
            CommonLibrary.executeInlineControlError(context, control, message);
        } else {
            CommonLibrary.clearValidationOnInput(control);
        }
    }

}
