import CommonLibrary from '../../Common/Library/CommonLibrary';
import TechnicalObjectCreateUpdateValidation from '../../Common/Validation/TechnicalObjectCreateUpdateValidation';
import ValidateActualWorkValue from '../../Expense/CreateUpdate/ValidateActualWorkValue';

export default function ServiceItemValidationRule(context) {
    return TechnicalObjectCreateUpdateValidation(context).then(() => {
        const amountControl = CommonLibrary.getControlProxy(context, 'AmountProperty');
        return ValidateActualWorkValue(context, amountControl, 15);
    });
}
