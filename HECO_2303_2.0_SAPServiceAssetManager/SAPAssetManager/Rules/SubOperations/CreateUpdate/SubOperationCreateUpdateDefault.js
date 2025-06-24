import libVal from '../../Common/Library/ValidationLibrary';
import EquipFLocIsAllowed from '../../WorkOrders/SubOperations/WorkOrderSubOperationIsEquipFuncLocAllowed';

export default function SubOperationCreateUpdateDefault(control) {
    
    if (libVal.evalIsEmpty(control.getPageProxy().binding)) {
        control.getPageProxy()._context.binding = control.binding;
    }

    if (control.getPageProxy().getClientData().overrideValue) { //Do not reset to default value when control is reloaded
        control.getPageProxy().getClientData().overrideValue = false;
        return '';
    }
    
    let name = control.getName();
    let context = control.getPageProxy();
    let formCellContainer = context.getControl('FormCellContainer');
    var extension;
    var value;

    return EquipFLocIsAllowed(control.getPageProxy()).then(result => {
        if (name === 'FuncLocHierarchyExtensionControl') {
            value = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
            if (!value) {
                value = context.binding.OperationFunctionLocation;
            }
            extension = formCellContainer.getControl('FuncLocHierarchyExtensionControl')._control._extension;
        } else {
            value = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
            if (!value) {
                value = context.binding.OperationEquipment;
            }
            extension = formCellContainer.getControl('EquipHierarchyExtensionControl')._control._extension;
        }
        if (extension) {
            if (!result) {
                extension.setEditable(false);
                return ''; //Do not default if not editable
            }
            extension.setData(value);
        }
        return '';
    });
}
