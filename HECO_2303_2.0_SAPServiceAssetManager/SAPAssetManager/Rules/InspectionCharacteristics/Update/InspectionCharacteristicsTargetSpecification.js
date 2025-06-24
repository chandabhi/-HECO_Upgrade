import inspCharLib from './InspectionCharacteristics';
import Logger from '../../Log/Logger';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export default async function InspectionCharacteristicsTargetSpecification(context) {
    let binding = context.binding;
    let targetValueString = '';

    if (inspCharLib.isQuantitative(binding) || inspCharLib.isCalculatedAndQuantitative(binding)) {
        try {
            let uom = binding.UoM || '';
            if (!uom) {
                if (binding.MasterInspChar_Nav) {
                    uom = binding.MasterInspChar_Nav.UoM;
                }
            }

            let lowerLimit, upperLimit = '';

            if (binding.LowerLimitFlag === '' && binding.UpperLimitFlag === '' && binding.MasterInspChar !== '') { //if both are empty and a linked measuring point exists then validate from measuring point's info
            
                let measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', 'MeasuringPoints', [], `$filter=CharName eq '${binding.MasterInspChar}'&$top=1`);
                if (measuringPointArray.length > 0) {
                    let measuringPoint = measuringPointArray.getItem(0);
                    lowerLimit = measuringPoint.IsLowerRange === 'X' ? measuringPoint.LowerRange : '';
                    upperLimit = measuringPoint.IsUpperRange === 'X' ? measuringPoint.UpperRange : '';
                }
            } else {
                lowerLimit = binding.LowerLimitFlag === 'X' ? binding.LowerLimit : '';
                upperLimit = binding.UpperLimitFlag === 'X' ? binding.UpperLimit : '';
            }

            if (lowerLimit && upperLimit) {
                targetValueString += `${lowerLimit} ${uom} < ${upperLimit} ${uom}`;
            } else if (lowerLimit && ValidationLibrary.evalIsEmpty(upperLimit)) {
                targetValueString += ` > ${lowerLimit} ${uom} `;
            } else if (ValidationLibrary.evalIsEmpty(lowerLimit) && upperLimit) {
                targetValueString += ` < ${upperLimit} ${uom} `;
            } 

            targetValueString += `(${context.localizeText('target_value')} ${binding.TargetValue})`;
            return targetValueString;
        } catch (err) {
            Logger.error(`Failed to populate the target spec: ${err}`);
            return '-';
        }
    }
    return targetValueString;
}
