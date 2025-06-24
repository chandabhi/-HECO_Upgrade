import libCom from '../../Common/Library/CommonLibrary';

export default function BatchValidateLength(context) {
    libCom.lengthFieldValidation(context, '/SAPAssetManager/Globals/Inventory/BatchFieldLength.global');

    let batchTo = context.getPageProxy().getControl('FormCellContainer').getControl('BatchNumTo');
    let valType = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationTypePicker');
    let valTypeTo = context.getPageProxy().getControl('FormCellContainer').getControl('ValuationToPicker');
    let items = valType.getPickerItems().map(val => val.ReturnValue);
    let batchVal = context.getValue();
    let batchToVal = batchTo.getValue();
    let valTypeVal = valType.getValue()[0];
    let valTypeToVal = valTypeTo.getValue()[0];
    let batchSet = false;
    let valTypeSet = false;
    let valTypeToSet = false;
    if (items.includes(batchVal)) {
        switch (context._control._props.definition.name) {
            case 'BatchSimple':
                if (!batchToVal && !valTypeVal && !valTypeToVal) {
                    batchSet = true;
                    valTypeSet = true;
                    valTypeToSet = true;
                }
                break;
            case 'BatchNumTo':
                if (!valTypeToVal) {
                    valTypeToSet = true;
                }
                break;
        }
    }
    if (batchSet) {
        batchTo.setValue(batchVal);
        batchTo.redraw();
    }
    if (valTypeSet) {
        valType.setValue(batchVal);
        valType.redraw();
    }
    if (valTypeToSet) {
        valTypeTo.setValue(batchVal);
        valTypeTo.redraw();
    }
}
