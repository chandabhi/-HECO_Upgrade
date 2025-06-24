import libVal from '../../Common/Library/ValidationLibrary';
import isIOS from '../../Common/IsIOS';

export default function WorkOrderCreateUpdateHierarchyListPickerOnLoaded(control) {
    if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
        control.getPageProxy()._context.binding = control.binding;
    }

    if (control.getPageProxy().getClientData().overrideValue) { //Do not reset to default value when control is reloaded
        control.getPageProxy().getClientData().overrideValue = false;
        return;
    }

    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    const controlFromFormCell = formCellContainer.getControl(name);

    //Flag setEmptyValue is used for reset value 
    //If setEmptyValue true, reset flag and keep control value empty
    if (controlFromFormCell.getClientData().setEmptyValue) {
        controlFromFormCell.getClientData().setEmptyValue = false;
        return;
    }

    if (name === 'FuncLocHierarchyExtensionControl') {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = context.binding.HeaderFunctionLocation;
        }
        if (value) {
            extension = controlFromFormCell._control._extension;
        }
    } else {
        value = controlFromFormCell.getValue();
        if (!value) {
            value = context.binding.HeaderEquipment;
        }
        if (value) {
            extension = controlFromFormCell._control._extension;
        }
    }
    if (extension) {
        extension.setData(value);
    }
    if (isIOS(context.getPageProxy())) { //Set focus back to description field
        let descriptionControl = formCellContainer.getControl('DescriptionNote');
        if (descriptionControl) {
            descriptionControl.setFocus();
        }
    }
}
