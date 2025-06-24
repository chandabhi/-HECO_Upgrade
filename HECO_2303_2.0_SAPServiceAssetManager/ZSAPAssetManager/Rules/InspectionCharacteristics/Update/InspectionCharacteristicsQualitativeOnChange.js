import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import ResetValidationOnInput from '../../Common/Validation/ResetValidationOnInput';
import {FDCSectionHelper} from '../../FDC/DynamicPageGenerator';

export default function InspectionCharacteristicsQualitativeOnChange(context) {
    ResetValidationOnInput(context);
    let fdcHelper = new FDCSectionHelper(context);
    let section = fdcHelper.findSection(context);
    if (section && Object.prototype.hasOwnProperty.call(section,'index') && section.index !== -1) {
        let index = section.index;
        let binding = section.binding;

        let value = '';
        let valuationControl = 'Valuation';
        if (inspCharLib.isQualitative(binding)) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'InspectionCodes', [], '$filter=(SelectedSet eq \'' + binding.SelectedSet + '\' and Plant eq \'' + binding.SelectedSetPlant + '\' and Catalog eq \'' + binding.Catalog + '\')').then( results => {
                let qualitativeControl = (results.length <= 4 ? 'QualitativeValueSegment' : 'QualitativeValue');
                let readLink = context.getPageProxy().getControls()[0].sections[index].getControl(qualitativeControl).getValue()[0].ReturnValue;
                return context.read('/SAPAssetManager/Services/AssetManager.service', readLink, [], '').then(function(result) {
                    if (result != null) {
                        value = "InspectionResultValuations('" + result.getItem(0).ValuationStatus + "')";
                        binding.Valuation = result.getItem(0).ValuationStatus;

                        let valCtrl = context.getPageProxy().getControls()[0].sections[index].getControl(valuationControl);
                        let valCtrlSpecifier = valCtrl.getTargetSpecifier();
                        valCtrlSpecifier.setQueryOptions("$filter=Valuation eq '" + binding.Valuation + "'");
                        valCtrl.setTargetSpecifier(valCtrlSpecifier);
                        valCtrl.setValue(value);

                        let extensionName;
                        let recordDefectsButtonName;

                        if (deviceType(context) === 'Tablet') {
                            extensionName = 'MyExtensionControlName';
                            recordDefectsButtonName = 'RecordDefectsButtonTablet';
                        } else {
                            extensionName = 'MyExtensionControlNameRecordDefect';
                            recordDefectsButtonName = 'RecordDefectsButton';
                        }

                        let buttonStack = extensionName;
                        let contextProxy = context.getPageProxy().getControls()[0].sections[index].getControl(buttonStack)._control._extension.context.clientAPI;
                        switch (binding.Valuation) {
                            case 'A':
                                valCtrl.setStyle('AcceptedGreen','Value');
                                break;
                            case 'R':
                            case 'F':
                                valCtrl.setStyle('RejectedRed','Value');
                                break;
                            default:
                                valCtrl.setStyle('GrayText','Value');
                                break;
                        }
                        if (binding.Valuation === 'R') {
                            if (inspCharLib.isManualDefectRecordingEnable(context)) {
                                MyButtonLib.setEditable(contextProxy, recordDefectsButtonName, true);
                            }
                        } else {
                            if (inspCharLib.isManualDefectRecordingEnable(context)) {
                                MyButtonLib.setEditable(contextProxy, recordDefectsButtonName, false);
                            }
                        }
                        context.getPageProxy().getControl('FormCellContainer').redraw();
                        context.clearValidation();
                    }
                });
            });
        }

    }
    //let suffix = name.substring(name.indexOf('_'), name.length);
}
