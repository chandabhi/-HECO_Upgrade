import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import libLocal from '../../Common/Library/LocalizationLibrary';
import libThis from './InspectionCharacteristics';
import libVal from '../../Common/Library/ValidationLibrary';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';
import {evaluateExpression} from '../../Common/Library/Evaluate';
import InspectionCharacteristicsLinkedMeasuringPointValidation from './InspectionCharacteristicsLinkedMeasuringPointValidation';

export default class {
    /*
    * determines if characteristic is of type quantitative
    */
    static isQuantitative(binding) {
        return (binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag === '');
    }

    /**
    * determines if characteristic is of type qualitative
    */
    static isQualitative(binding) {
        return (binding.QuantitativeFlag === '' && binding.CalculatedCharFlag === '');
    }

    /**
    * determines if characteristic is of type calculated
    */
    static isCalculatedAndQuantitative(binding) {
        return (binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag === 'X');
    }

    /**
    * determines if the formula is a target value
    */
    static isCalculatedTargetValue(formula) {
        return (formula.startsWith('C7') || formula.startsWith('c7'));
    }

    /**
    * determines if the formula is a input value
    */
    static isCalculatedInputValue(formula) {
        return (formula.startsWith('C0') || formula.startsWith('c0'));
    }

    /**
    * determines if flag ManualDefectRecording is enable or not
    */
     static isManualDefectRecordingEnable(context) {
        if (enableMaintenanceTechnician(context)) {
            return (libCom.getAppParam(context, 'EAM_CHECKLIST', 'ManualDefectRecording') === 'Y');
        }
        return false;
    }

    /**
    * calculate the formula ((CD0004+CE0050)*2)+DE0050)  = ((30+20)*2)+50)
    * CD0004
    * CD
    * 0004
    */
    static calulateFormula(context, binding) {
        try {
            if (binding.Formula1) {
                let formula = binding.Formula1;
                let split = formula.match(/([A-Z0-9]{2})([0-9]{4})/g);
                let codes = [];
                let reads = [];
                for (let i=0; i<split.length; i++) {
                    let values = split[i].match(/([A-Z0-9]{2})([0-9]{4})/);
                    let property = libCom.getAppParam(context, 'QMFORMULA',values[1]);
                    codes.push({
                        'Code': values[0],
                        'Item': values[2],
                        'Property': property,
                    });
                }
                let charFound = false;
                let foundError = false;
                let calculateFormula = formula;
                for (let j=0; j< codes.length; j++) {
                    //find the characteristic on the FDC screen
                    let sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
                    if (sectionBindings && sectionBindings.length > 0) {
                        for (let i=0; i < sectionBindings.length; i++) {
                            //let section = sections[i];
                            let sectionBinding = sectionBindings[i];
                            let odataType = sectionBinding['@odata.type'];
                            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                                let entity = `InspectionCharacteristics(InspectionLot='${binding.InspectionLot}',InspectionNode='${binding.InspectionNode}',InspectionChar='${codes[j].Item}',SampleNum='${binding.SampleNum}')`;
                                let sectionReadLink = sectionBinding['@odata.readLink'];
                                if (entity === sectionReadLink) {
                                    charFound = true;
                                    //let suffix = `_0_${i}`;
                                    let valueControl = 'QuantitativeValue';
                                    let extensionName;
                                    let validateButtonName;

                                    if (deviceType(context) === 'Tablet') {
                                        extensionName = 'MyExtensionControlName';
                                        validateButtonName = 'ValidateOrCalculateButtonTablet';
                                    } else {
                                        extensionName = 'MyExtensionControlNameValidate';
                                        validateButtonName = 'ValidateOrCalculateButton';
                                    }

                                    let buttonStack = extensionName;
                                    let contextProxy = context.getPageProxy().getControls()[0].sections[i].getControl(buttonStack)._control._extension.context.clientAPI;
                                    let value = parseFloat(context.getPageProxy().getControls()[0].sections[i].getControl(valueControl).getValue());
                                    if (libVal.evalIsEmpty(value) || isNaN(value)) {
                                        libCom.setInlineControlErrorVisibility(context.getPageProxy().getControls()[0].sections[i].getControl(valueControl), false);
                                        context.getPageProxy().getControls()[0].sections[i].getControl(valueControl).clearValidation();
                                        libCom.setInlineControlError(context, context.getPageProxy().getControls()[0].sections[i].getControl(valueControl), context.localizeText('field_is_required'));
                                        context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer').redraw();
                                        foundError = true;
                                    } else {
                                        context.getPageProxy().getControls()[0].sections[i].getControl(valueControl).clearValidation();
                                        context.getPageProxy().getControl('FormCellContainer').redraw();
                                        MyButtonLib.setEditable(contextProxy, validateButtonName, true);
                                        calculateFormula = calculateFormula.replace(codes[j].Code,value);
                                    }
                                }
                            }
                        }
                    }
                    if (!charFound) {
                        reads.push(this.read(context, codes[j]));
                    }
                }
                if (!charFound) {
                    return Promise.all(reads).then((results) => {
                        let formulaexp = formula;
                        for (let k=0; k< codes.length; k++) {
                            formulaexp = formulaexp.replace(codes[k].Code,results[k]);
                        }
                        return evaluateExpression(formulaexp);
                    }).catch(() => {
                        return Promise.resolve(0);
                    });
                }
                if (!foundError) {
                    return Promise.resolve(evaluateExpression(calculateFormula));
                }
            }
        } catch (error) {
            Logger.info('calulateFormula - formula - ' + context.binding.Formula1 + ' ,error - ' + error);
        }
        return Promise.resolve(0);
    }

    static read(context, code) {
        let entity = `InspectionCharacteristics(InspectionLot='${context.binding.InspectionLot}',InspectionNode='${context.binding.InspectionNode}',InspectionChar='${code.Item}',SampleNum='${context.binding.SampleNum}')`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], '').then(result => {
            if (result && result.length > 0) {
                let row = result.getItem(0);
                if (Object.prototype.hasOwnProperty.call(row,code.Property)) {
                    return row[code.Property];
                }
                return 0;
            }
            return 0;
        }).catch(() => {
            return 0;
        });
    }

    static async validateAllCharacteristics(context) {
        let rejectedChars = [];
        let sections = context.getPageProxy().getControls()[0].sections;
        let sectionBindings = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings;
        if (sections && sections.length > 0) {
            for (let i=0; i < sections.length; i++) {
                let section = sections[i];
                let odataType = sectionBindings[i]['@odata.type'];
                if (odataType === '#sap_mobile.InspectionCharacteristic') {
                    await libThis.validateCharacteristic(context, sectionBindings[i], section, i);
                    if (!libVal.evalIsEmpty(sectionBindings[i].Valuation) && sectionBindings[i].Valuation === 'R') {
                        sectionBindings[i].UniqueId = `${sectionBindings[i].InspectionLot}-${sectionBindings[i].InspectionNode}-${sectionBindings[i].InspectionChar}-${sectionBindings[i].SampleNum}`; //need this to identify the characteristic
                        rejectedChars.push(sectionBindings[i].UniqueId);
                    }
                }
            }
        }
        context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().RejectedChars = rejectedChars;
    }

    static async validateCharacteristic(context, sectionBinding, section, index) {
        if (libThis.isQuantitative(sectionBinding)) {
            await this.setCharacteristicValuation(context, sectionBinding, section, section.getControl('QuantitativeValue'), index);
        }
    }

    static async setCharacteristicValuation(context, sectionBinding, section, quantitativeControl, index) {
        let valuationControl = 'Valuation';
        let validateExtensionName;
        let defectExtensionName;
        let validateButtonName;
        let recordDefectsButtonName;
        let value = quantitativeControl.getValue();
        let valueAccepted = true;
        if (!libVal.evalIsEmpty(value)) {
            value = parseFloat(value);
        }

        if (deviceType(context) === 'Tablet') {
            validateExtensionName = defectExtensionName = 'MyExtensionControlName';
            validateButtonName = 'ValidateOrCalculateButtonTablet';
            recordDefectsButtonName = 'RecordDefectsButtonTablet';
        } else {
            validateExtensionName = 'MyExtensionControlNameValidate';
            defectExtensionName = 'MyExtensionControlNameRecordDefect';
            validateButtonName = 'ValidateOrCalculateButton';
            recordDefectsButtonName = 'RecordDefectsButton';
        }

        let validateButtonStack = validateExtensionName;
        let validateContextProxy = context.getPageProxy().getControls()[0].sections[index].getControl(validateButtonStack)._control._extension.context.clientAPI;
        if (libVal.evalIsEmpty(validateContextProxy)) {
            validateContextProxy = context.getPageProxy().getControls()[0].sections[index].getControl(validateButtonStack)._control._extension.context.clientAPI;
        }
        if (libVal.evalIsEmpty( quantitativeControl.getValue())) {
            return this.setInlineError(context, quantitativeControl, context.localizeText('field_is_required'));
        }
        if (!libLocal.isNumber(context, quantitativeControl.getValue())) {
            return this.setInlineError(context, quantitativeControl, context.localizeText('validation_reading_is_numeric'));
        }

        let defectButtonStack = defectExtensionName;
        let defectContextProxy = context.getPageProxy().getControls()[0].sections[index].getControl(defectButtonStack)._control._extension.context._clientAPI;
        if (!libVal.evalIsEmpty(value)) { //For the purposes of the filter, only validate if user entered a value
            
            if (sectionBinding.LowerLimitFlag === 'X' && value < sectionBinding.LowerLimit) {
                valueAccepted = false;
            }

            if (valueAccepted && sectionBinding.UpperLimitFlag === 'X') {
                if (sectionBinding.UpperLimit > value) {
                    valueAccepted = true;
                } else {
                    valueAccepted = false;
                }
            }

            if (valueAccepted && sectionBinding.CharId !== '' && sectionBinding.CharId !== '0000000000') { //if a linked measuring point exists then validate from measuring point's info

                let linkedMeasuringPoint = await libThis.getLinkedMeasuringPoint(context, sectionBinding);

                if (linkedMeasuringPoint) {
                    valueAccepted = await InspectionCharacteristicsLinkedMeasuringPointValidation(context, linkedMeasuringPoint, quantitativeControl).then(() => {
                        return true;
                    }).catch(() => {
                        return false;
                    });
                }
            }
            
        } 

        if (valueAccepted) {
            sectionBinding.Valuation='A';
            context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl).setValue("InspectionResultValuations('A')");
            if (libThis.isManualDefectRecordingEnable(context)) {
                MyButtonLib.setEditable(defectContextProxy, recordDefectsButtonName, false);
            }
        } else {
            sectionBinding.Valuation='R';
            context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl).setValue("InspectionResultValuations('R')");
            if (libThis.isManualDefectRecordingEnable(context)) {
                MyButtonLib.setEditable(defectContextProxy, recordDefectsButtonName, true);
            }
        }
        if (libThis.isQuantitative(section.binding)) {
            MyButtonLib.setTitle(validateContextProxy, validateButtonName, validateContextProxy.localizeText('validated'));
            MyButtonLib.setEditable(validateContextProxy, validateButtonName, false);
        }
        return true;
    }

    static async setInlineError(context, controlName, message) {
        libCom.executeInlineControlError(context, controlName, message);
        return false;
    }

    /* 
        Go to the Inspection Lot and find the measuring points from the related technical object (equipment first then functional location)
        Then from these measuring points find the first one that matches the CharId
    */

    static async getLinkedMeasuringPoint(context, inspectionChar) {
        let inspectionLotArray = await context.read('/SAPAssetManager/Services/AssetManager.service', `${inspectionChar['@odata.readLink']}/InspectionLot_Nav`, [], '');

        if (inspectionLotArray.length > 0) {
            let inspectionLot = inspectionLotArray.getItem(0);

            if (inspectionLot) {
                let measuringPointArray = [];
                let equipment = inspectionLot.Equipment;
                let functionalLocation = inspectionLot.FunctionalLocation;
                let queryOptions = `$filter=CharId eq '${inspectionChar.CharId}'&$top=1`;
        
                if (equipment) {
                    let count = await context.count('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')`, '');
                    if (count > 0) {
                        measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyEquipments('${equipment}')/MeasuringPoints`, [], queryOptions);
                        if (measuringPointArray.length > 0) {
                            return measuringPointArray.getItem(0);
                        }
                    }
                }

                if (functionalLocation) {
                    let count = await context.count('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${functionalLocation}')`, '');
                    if (count > 0) {
                        measuringPointArray = await context.read('/SAPAssetManager/Services/AssetManager.service', `MyFunctionalLocations('${functionalLocation}')/MeasuringPoints`, [], queryOptions);
                        if (measuringPointArray.length > 0) {
                            return measuringPointArray.getItem(0);
                        }
                    }
                }

            }
        }

        return '';
    }
}
