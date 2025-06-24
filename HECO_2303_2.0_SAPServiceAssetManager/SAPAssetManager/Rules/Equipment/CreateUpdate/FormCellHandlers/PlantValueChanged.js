import PlantValueChangedCommon from '../../../Common/Controls/Handlers/PlantValueChanged';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';

export default function PlantValueChanged(context) {
    PlantValueChangedCommon(context);
    ResetValidationOnInput(context);
    let flocExtension = context.getPageProxy().getControl('FormCellContainer').getControl('FuncLocHierarchyExtensionControl')._control._extension;
    if (flocExtension) {
        flocExtension.reload();
    }
}
