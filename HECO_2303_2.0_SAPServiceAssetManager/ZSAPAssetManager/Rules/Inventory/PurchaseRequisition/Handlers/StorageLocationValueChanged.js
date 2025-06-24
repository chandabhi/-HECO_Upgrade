import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function StorageLocationValueChanged(control) {
    let value = control.getValue();
    let materilaQueryOptions = '$expand=Material,MaterialSLocs&$orderby=MaterialNum,Plant';

    if (value.length > 0) {
        const slocLink = value[0].ReturnValue;
        const slocLinkObject = SplitReadLink(slocLink);
        const plant = slocLinkObject.Plant;
        const sloc = slocLinkObject.StorageLocation;

        materilaQueryOptions += `&$filter=Plant eq '${plant}' and MaterialSLocs/any(slocs : slocs/StorageLocation eq '${sloc}')`;
    }

    PurchaseRequisitionLibrary.setControlTarget(control, 'MaterialListPicker', materilaQueryOptions);
}
