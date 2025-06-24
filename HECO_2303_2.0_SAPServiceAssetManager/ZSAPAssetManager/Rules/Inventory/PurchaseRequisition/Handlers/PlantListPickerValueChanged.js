import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function PlantListPickerValueChanged(control) {
    ResetValidationOnInput(control);
    let value = control.getValue();
    let materialQueryOptions = '$expand=Material,MaterialSLocs&$orderby=MaterialNum,Plant';
    let slocQueryOptions = '$orderby=StorageLocation';

    if (value.length > 0) {
        let plant = value[0].ReturnValue;

        materialQueryOptions += `&$filter=Plant eq '${plant}' `;
        slocQueryOptions += `&$filter=Plant eq '${plant}' `;
    }

    PurchaseRequisitionLibrary.setControlTarget(control, 'MaterialListPicker', materialQueryOptions);
    PurchaseRequisitionLibrary.setControlTarget(control, 'StorageLocationLstPkr', slocQueryOptions);     
}
