import { SplitReadLink } from '../../../Common/Library/ReadLinkUtils';
import ResetValidationOnInput from '../../../Common/Validation/ResetValidationOnInput';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function MaterialListPickerValueChanged(context) {
    ResetValidationOnInput(context);
    let value = context.getValue();
    let valuationTypeQueryOptions = '$orderby=ValuationType';

    if (value.length > 0) {
        const materialLink = value[0].ReturnValue;
        const materilaLinkObject = SplitReadLink(materialLink);

        let uomValue = '';
        let description = '';
        let storageBin = '';
        let batchIndicatorFlag = false;
        let valuationFlag = false;
 
        return context.read('/SAPAssetManager/Services/AssetManager.service', materialLink, [], '$expand=Material,MaterialSLocs').then(result => {
            if (result && result.length > 0) {
                let material = result.getItem(0);
   
                uomValue = material.Material ? material.Material.BaseUOM : '';
                description = material.Material ? material.Material.Description : '';
                storageBin = material.MaterialSLocs && material.MaterialSLocs.length ? material.MaterialSLocs[0].StorageBin : '';
                if (material.BatchIndicator === 'X') {
                    batchIndicatorFlag = true;
                }
                if (material.ValuationCategory) {
                    valuationFlag = true;
                }
            }

            PurchaseRequisitionLibrary.setControlProperties(context, 'QuantitySimple', '0');
            PurchaseRequisitionLibrary.setControlProperties(context, 'UOMSimple', uomValue);
            PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialDescriptionSimple', description);
            PurchaseRequisitionLibrary.setControlProperties(context, 'StrorageBinSimple', storageBin);
            PurchaseRequisitionLibrary.setControlTarget(context, 'ValuationTypePicker', valuationTypeQueryOptions + `&$filter=Material eq '${materilaLinkObject.MaterialNum}'`);
            PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialBatch', '', batchIndicatorFlag);

            return context.count('/SAPAssetManager/Services/AssetManager.service', 'MaterialValuations', valuationTypeQueryOptions + `&$filter=Material eq '${materilaLinkObject.MaterialNum}'`).then(count => {
                PurchaseRequisitionLibrary.setControlProperties(context, 'ValuationTypePicker', '', !!(count) && valuationFlag);
            });
        });
    } else {
        PurchaseRequisitionLibrary.setControlProperties(context, 'QuantitySimple', '0');
        PurchaseRequisitionLibrary.setControlProperties(context, 'UOMSimple', '');
        PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialDescriptionSimple', '');
        PurchaseRequisitionLibrary.setControlProperties(context, 'StrorageBinSimple', '');
        PurchaseRequisitionLibrary.setControlProperties(context, 'MaterialBatch', '', false);
        PurchaseRequisitionLibrary.setControlTarget(context, 'ValuationTypePicker', valuationTypeQueryOptions);
        PurchaseRequisitionLibrary.setControlProperties(context, 'ValuationTypePicker', '', false);
    }
}
