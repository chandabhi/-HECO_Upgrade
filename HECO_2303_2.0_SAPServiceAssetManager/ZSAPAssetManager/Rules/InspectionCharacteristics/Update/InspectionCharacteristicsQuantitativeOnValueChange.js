import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';

export default function InspectionCharacteristicsQuantitativeOnValueChange(context) {
    ResetValidationOnInput(context);
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let index = section.index;
        let binding = section.binding;
        let extensionName;
        let validateButtonName;

        if (deviceType(context) === 'Tablet') {
            extensionName = 'MyExtensionControlName';
            validateButtonName = 'ValidateOrCalculateButtonTablet';
        } else {
            extensionName = 'MyExtensionControlNameValidate';
            validateButtonName = 'ValidateOrCalculateButton';
        }

        let buttonStack = extensionName;
        let contextProxy = context.getPageProxy().getControls()[0].sections[index].getControl(buttonStack)._control._extension.context.clientAPI;
        if (inspCharLib.isCalculatedAndQuantitative(binding)) {
            MyButtonLib.setTitle(contextProxy, validateButtonName, context.localizeText('calculate'));
            MyButtonLib.setEditable(contextProxy, validateButtonName, true);
        } else if (inspCharLib.isQuantitative(binding)) {
            MyButtonLib.setTitle(contextProxy, validateButtonName, context.localizeText('validate'));
            MyButtonLib.setEditable(contextProxy, validateButtonName, true);
        }
    }
}
