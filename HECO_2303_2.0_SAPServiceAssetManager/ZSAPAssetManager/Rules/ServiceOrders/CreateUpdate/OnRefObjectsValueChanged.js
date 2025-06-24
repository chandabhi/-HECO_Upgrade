import CommonLibrary from '../../Common/Library/CommonLibrary';


export default function OnRefObjectsValueChanged(clientAPI) {    
    const pageProxy = clientAPI.getPageProxy();
    const formCellContainer = pageProxy.getControl('FormCellContainer');
    const productIdListPickerControl = formCellContainer.getControl('ProductLstPkr');
    const productIdListPickerValue = formCellContainer.getControl('ProductLstPkr').getValue();
    const equipmentHierarchyListPickerControl = CommonLibrary.getControlProxy(pageProxy, 'EquipHierarchyExtensionControl');
    const equipmentHierarchyListPickerValue = formCellContainer.getControl('EquipHierarchyExtensionControl').getValue();
    const funcLocHierarchyListPickerControl = CommonLibrary.getControlProxy(pageProxy, 'FuncLocHierarchyExtensionControl');
    const funcLocHierarchyListPickerValue = formCellContainer.getControl('FuncLocHierarchyExtensionControl').getValue();
   
    if (productIdListPickerValue.length) {
        funcLocHierarchyListPickerControl.setEditable(false);
        funcLocHierarchyListPickerControl.setValue(null);
        equipmentHierarchyListPickerControl.setEditable(false);
        equipmentHierarchyListPickerControl.setValue(null);
    } else if (equipmentHierarchyListPickerValue) {
        productIdListPickerControl.setEditable(false);
        productIdListPickerControl.setValue(null);
        funcLocHierarchyListPickerControl.setEditable(false);
        funcLocHierarchyListPickerControl.setValue(null);
    } else if (funcLocHierarchyListPickerValue) {
        productIdListPickerControl.setEditable(false);
        productIdListPickerControl.setValue(null);
        equipmentHierarchyListPickerControl.setEditable(false);
        equipmentHierarchyListPickerControl.setValue(null);
    } else {
        productIdListPickerControl.setEditable(true);
        funcLocHierarchyListPickerControl.setEditable(true);
        equipmentHierarchyListPickerControl.setEditable(true);
    }
}
