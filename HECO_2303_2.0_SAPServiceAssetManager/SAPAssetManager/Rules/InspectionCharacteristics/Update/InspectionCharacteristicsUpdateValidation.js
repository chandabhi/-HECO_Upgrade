import libCom from '../../Common/Library/CommonLibrary';
import inspCharLib from './InspectionCharacteristics';
import libLocal from '../../Common/Library/LocalizationLibrary';
import InspectionCharacteristicsLinkedMeasuringPointValidation from './InspectionCharacteristicsLinkedMeasuringPointValidation';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default async function InspectionCharacteristicsUpdateValidation(context, sectionBinding, section) {
    let qualitativeValueControl = section.getControl('QualitativeValue');
    let qualitativeValueSegmentControl = section.getControl('QualitativeValueSegment');
    let quantitativeControl = section.getControl('QuantitativeValue');
    if (qualitativeValueControl.visible) {
        libCom.setInlineControlErrorVisibility(qualitativeValueControl, false);
        qualitativeValueControl.clearValidation();
    } else {
        libCom.setInlineControlErrorVisibility(qualitativeValueSegmentControl, false);
        qualitativeValueSegmentControl.clearValidation();
    }
    libCom.setInlineControlErrorVisibility(quantitativeControl, false);
    quantitativeControl.clearValidation();

    if (inspCharLib.isQuantitative(sectionBinding) || inspCharLib.isCalculatedAndQuantitative(sectionBinding)) {
        let value = section.getControl('QuantitativeValue').getValue();
        if (!libLocal.isNumber(context, value)) {
            return setInlineError(section.getControl('QuantitativeValue'), context.localizeText('validation_reading_is_numeric'));
        } else {
            let valueAccepted = true;
            let lowerLimitValidationPassed = true;
            let upperLimitValidationPassed = true;

            if (sectionBinding.LowerLimitFlag === 'X' && value < sectionBinding.LowerLimit) {
                valueAccepted = false;
                lowerLimitValidationPassed = false;
            }
            
            if (sectionBinding.UpperLimitFlag === 'X' && value > sectionBinding.UpperLimit) {
                valueAccepted = false;
                upperLimitValidationPassed = false;
            }

            if (!valueAccepted) {
                let errorString = '';

                if (!lowerLimitValidationPassed) {
                    errorString += context.localizeText('validation_reading_below_lower_range_of', [sectionBinding.LowerLimit]);
                }

                if (!upperLimitValidationPassed) {
                    errorString += context.localizeText('validation_reading_exceeds_upper_range_of', [sectionBinding.UpperLimit]);
                }

                let errorStringWithNewLines = CommonLibrary.addNewLineAfterSentences(errorString);
                return setInlineError(section.getControl('QuantitativeValue'), errorStringWithNewLines);
            }

            if (sectionBinding.CharId !== '' && sectionBinding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info
        
                let linkedMeasuringPoint = await inspCharLib.getLinkedMeasuringPoint(context, sectionBinding);
                
                if (linkedMeasuringPoint) {
                    valueAccepted = await InspectionCharacteristicsLinkedMeasuringPointValidation(context, linkedMeasuringPoint, quantitativeControl).then(() => {
                        return true;
                    }).catch(() => {
                        return false;
                    });

                    return valueAccepted;
                }
                
            }
        }

    }
    return true;

    function setInlineError(controlName, message) {
        libCom.executeInlineControlError(context, controlName, message);
        return true;
    }
}
