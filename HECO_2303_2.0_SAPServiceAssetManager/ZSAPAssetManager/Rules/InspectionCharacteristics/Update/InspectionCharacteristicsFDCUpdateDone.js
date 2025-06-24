import inspCharLib from './InspectionCharacteristics';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';
import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';
import InspectionCharacteristicsUpdateValidation from './InspectionCharacteristicsUpdateValidation';
import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import InspectionCharacteristicsChangeSetOnSuccess from './InspectionCharacteristicsChangeSetOnSuccess';

export default function InspectionCharacteristicsFDCUpdateDone(context) {
   let fdcHelper = new FDCSectionHelper(context);
    // Validate all sections first
    return fdcHelper.run((sectionBinding, section) => {
        return InspectionCharacteristicsUpdateValidation(context, sectionBinding, section).then((isValid) => {
            return isValid ? Promise.resolve() : Promise.reject();
        });
    }).then(() => {
        return fdcHelper.run(async (sectionBinding, section) => {
            let valuation = getValuation(sectionBinding, section);
            let valuationReaddlink = getValuationReaddlink(sectionBinding, section);
            if ((inspCharLib.isQuantitative(sectionBinding) || inspCharLib.isCalculatedAndQuantitative(sectionBinding)) && (!libVal.evalIsEmpty(section.getControl('QuantitativeValue').getValue())) && (libLocal.isNumber(context, section.getControl('QuantitativeValue').getValue()))) {
                let resultValue = section.getControl('QuantitativeValue').getValue();
                if (typeof(resultValue) === 'string' && libCom.isDefined(resultValue)) {
                    resultValue = libLocal.toNumber(context, resultValue);
                }

                return context.executeAction({'Name': '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeUpdate.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': sectionBinding['@odata.readLink'],
                    },
                    'Properties': {
                        'ResultValue': resultValue,
                        'Valuation': valuation,
                    },
                    'Headers':
                    {
                        'OfflineOData.TransactionID': sectionBinding.InspectionLot_Nav.InspectionLot,
                    },
                    'UpdateLinks':
                    [{
                        'Property': 'InspValuation_Nav',
                        'Target': {
                            'EntitySet': 'InspectionResultValuations',
                            'ReadLink': valuationReaddlink,
                        },
                    }],
                    'ValidationRule': '',
                }}).catch(() => {
                    return false;
                }).finally(() => {
                    return true;
                });
            } else if (inspCharLib.isQualitative(sectionBinding) && (!libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0]) || !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0]))) {
                let CodeGroup = '';
                let Code = '';
                let Catalog = '';
                let valuationReturnValue = section.getControl('Valuation').getValue()[0].ReturnValue;
                valuation = valuationReturnValue.substring(valuationReturnValue.indexOf('\'')+1, valuationReturnValue.indexOf('\'')+2);
                if (!libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0])) {
                    CodeGroup = SplitReadLink(section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue).CodeGroup;
                    Code = SplitReadLink(section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue).Code;
                    Catalog = SplitReadLink(section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue).Catalog;
                } else if (!libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0])) {
                    CodeGroup = SplitReadLink(section.getControl('QualitativeValue').getValue()[0].ReturnValue).CodeGroup;
                    Code = SplitReadLink(section.getControl('QualitativeValue').getValue()[0].ReturnValue).Code;
                    Catalog = SplitReadLink(section.getControl('QualitativeValue').getValue()[0].ReturnValue).Catalog;
                }

                var createLinks = [];
                if (libVal.evalIsEmpty(sectionBinding.InspValuation_Nav) && !libVal.evalIsEmpty(section.getControl('Valuation').getValue()[0])) {
                    createLinks.push({
                        'Property': 'InspValuation_Nav',
                        'Target':
                        {
                            'EntitySet': 'InspectionResultValuations',
                            'ReadLink': section.getControl('Valuation').getValue()[0].ReturnValue,
                        },
                    });
                }
                if (libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0])) {
                    createLinks.push({
                        'Property': 'InspectionCode_Nav',
                        'Target':
                        {
                            'EntitySet': 'InspectionCodes',
                            'ReadLink': section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue,
                        },
                    });
                } else if (libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0])) {
                    createLinks.push({
                        'Property': 'InspectionCode_Nav',
                        'Target':
                        {
                            'EntitySet': 'InspectionCodes',
                            'ReadLink': section.getControl('QualitativeValue').getValue()[0].ReturnValue,
                        },
                    });
                }

                var updateLinks = [];
                if (!libVal.evalIsEmpty(sectionBinding.InspValuation_Nav) && !libVal.evalIsEmpty(section.getControl('Valuation').getValue()[0])) {
                    updateLinks.push({
                        'Property': 'InspValuation_Nav',
                        'Target':
                        {
                            'EntitySet': 'InspectionResultValuations',
                            'ReadLink': section.getControl('Valuation').getValue()[0].ReturnValue,
                        },
                    });
                }
                if (!libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0])) {
                    updateLinks.push({
                        'Property': 'InspectionCode_Nav',
                        'Target':
                        {
                            'EntitySet': 'InspectionCodes',
                            'ReadLink': section.getControl('QualitativeValue').getValue()[0].ReturnValue,
                        },
                    });
                } else if (!libVal.evalIsEmpty(sectionBinding.InspectionCode_Nav) && !libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0])) {
                    updateLinks.push({
                        'Property': 'InspectionCode_Nav',
                        'Target':
                        {
                            'EntitySet': 'InspectionCodes',
                            'ReadLink': section.getControl('QualitativeValueSegment').getValue()[0].ReturnValue,
                        },
                    });
                }

                return context.executeAction({'Name': '/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeUpdate.action', 'Properties': {
                    'Target': {
                        'EntitySet': 'InspectionCharacteristics',
                        'Service': '/SAPAssetManager/Services/AssetManager.service',
                        'ReadLink': sectionBinding['@odata.readLink'],
                    },
                    'Properties':
                    {
                        'CodeGroup': CodeGroup,
                        'Valuation': valuation,
                        'Code': Code,
                        'Catalog': Catalog,

                    },
                    'CreateLinks': createLinks,
                    'UpdateLinks': updateLinks,
                    'Headers':
                    {
                        'OfflineOData.TransactionID': sectionBinding.InspectionLot_Nav.InspectionLot,
                    },
                    'ValidationRule': '',
                }}).catch(() => {
                    return false;
                }).finally(() => {
                    return true;
                });
            }
            return false;
        }).catch(() => {
            return false;
        });
    }).then((results) => {
        if (results.some(value => value === true || value instanceof Object)) {
            return InspectionCharacteristicsChangeSetOnSuccess(context);
        }
        return Promise.resolve();
    });
}

function getValuation(sectionBinding, section) {
    if (isValueAccepted(sectionBinding, section)) {
        return 'A';
    }
    return 'R';
}

function getValuationReaddlink(sectionBinding, section) {
    if (isValueAccepted(sectionBinding, section)) {
        return 'InspectionResultValuations(\'A\')';
    }
    return 'InspectionResultValuations(\'R\')';
}


function isValueAccepted(sectionBinding, section) {
    if ((inspCharLib.isQuantitative(sectionBinding) || inspCharLib.isCalculatedAndQuantitative(sectionBinding)) && (sectionBinding.TargetValue === section.getControl('QuantitativeValue').getValue())) {
        return true;
    } else {
        let valueAccepted = true;
        const value = section.getControl('QuantitativeValue').getValue();
        if (sectionBinding.LowerLimitFlag === 'X' && value < sectionBinding.LowerLimit) {
            valueAccepted = false;
        }
        if (sectionBinding.UpperLimitFlag === 'X' && value > sectionBinding.UpperLimit) {
            valueAccepted = false;
        }
        if (valueAccepted) {
            return true;
        } else {
            return false;
        }
    }
}

