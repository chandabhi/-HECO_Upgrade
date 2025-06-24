import libCommon from '../../../Common/Library/CommonLibrary';
import {CreateUpdateFunctionalLocationEventLibrary as libFLOC} from '../../FunctionalLocationLibrary';

export default function IdValueChangedForFlocId(control) {
    const proxy = control.getPageProxy();
    let enteredValue = control.getValue().toUpperCase();
    let mask = libCommon.getStateVariable(proxy, 'EditMask');
    let validated = proxy.getClientData().validated;

    if (mask) {
        if (libFLOC.validateId(enteredValue, mask)) {
            control.clearValidation();
            proxy.getClientData().validated = false;
            control.setHelperText('');
            control.setValue(enteredValue, false);
        } else if (!validated) {
            proxy.getClientData().validated = true;
            libCommon.setInlineControlError(control, control, control.localizeText('wrong_value', [mask]));
            control.applyValidation();
        }
    }
}
