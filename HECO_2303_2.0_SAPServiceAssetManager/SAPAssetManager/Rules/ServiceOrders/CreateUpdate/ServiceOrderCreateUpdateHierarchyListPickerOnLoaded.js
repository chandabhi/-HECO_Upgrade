import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import IsRefObjectPickerEditable from './IsRefObjectPickerEditable';

export default function ServiceOrderCreateUpdateHierarchyListPickerOnLoaded(control) {
    if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
        control.getPageProxy()._context.binding = control.binding;
    }

    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    const controlFromFormCell = formCellContainer.getControl(name);
    const isOnEdit = !libCommon.IsOnCreate(context);
    const binding = context.binding;
    const refObj = binding.RefObj_Nav && binding.RefObj_Nav[0];

    //Flag setEmptyValue is used for reset value 
    //If setEmptyValue true, reset flag and keep control value empty
    if (controlFromFormCell.getClientData().setEmptyValue) {
        controlFromFormCell.getClientData().setEmptyValue = false;

        return;
    }

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = binding.HeaderFunctionLocation || (refObj && refObj.FLocID);
        }
        extension = controlFromFormCell._control._extension;
    } else {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = binding.HeaderEquipment || (refObj && refObj.EquipID);
        }
        extension = controlFromFormCell._control._extension;
    }
    if (extension) {
        extension.setData(value);
    }
    if (isOnEdit || control.binding.ObjectID) {
        const isEditable = IsRefObjectPickerEditable(control);
        extension.setEditable(isEditable);
    }
}
