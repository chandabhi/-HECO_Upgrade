
import libVal from '../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import {evaluateBooleanExpression} from '../../Common/Library/Evaluate';

export default function InspectionCharacteristicsFDCFilter(context) {

    let previousPage = context.evaluateTargetPathForAPI('#Page:OverviewPage').getClientData().FDCPreviousPage;
    let sectionBindings = context.evaluateTargetPathForAPI('#Page:' + previousPage).getClientData().SectionBindings;
    let equipments = [];
    let funcLocs = [];
    let operations =[];

    if (sectionBindings && sectionBindings.length > 0) {
        for (let sectionBinding of sectionBindings) {
            let odataType = sectionBinding['@odata.type'];
            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                let equipId = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.Equipment:sectionBinding.InspectionPoint_Nav.EquipNum;
                let funcLoc = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.FunctionalLocation: sectionBinding.InspectionPoint_Nav.FuncLocIntern;
                let operationNum = (sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.OperationNo : sectionBinding.InspectionPoint_Nav.OperationNo;

                if (!libVal.evalIsEmpty(equipId) && !equipments.includes(equipId)) {
                    equipments.push(equipId);
                }

                if (!libVal.evalIsEmpty(funcLoc) && !funcLocs.includes(funcLoc)) {
                    funcLocs.push(funcLoc);
                }

                if (!libVal.evalIsEmpty(operationNum) && !operations.includes(operationNum)) {
                    operations.push(operationNum);
                }
            }
        }
    }
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Equipments = equipments;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().FuncLocs = funcLocs;
    context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getClientData().Operations = operations;


    return context.executeAction('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsFDCFilterNav.action').then(async filterResult => {

        // For each section, determine if filter criteria states it should (not) be displayed
        const sections = context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').getControls()[0].sections;
        let resultsCount = 0;

        for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex ++) {
            const section = sections[sectionIndex];
            // Truncate $filter= from filter
            let filter = filterResult.data.filter.match(/\$filter=(.*)/)[1];

            let newFilter = filter.replace(/([_\w]+) eq '([\d\w-]+)'/g, (expr) => {
                // Create an object of key-value pairs, e.g. "(__Status: eq 'Error')" ==> {'Status' : 'Error'}
                let obj = Object.fromEntries([Object.values(expr.match(/(?<key>\w+) eq '(?<value>[\d\w-]+)'/).groups)]);

                const sectionBinding = context.evaluateTargetPathForAPI('#Page:-Previous').getClientData().SectionBindings[sectionIndex];

                // __Status is a special property that won't be in an OData entity set. Handle this separately
                if (obj.FilterSeg) {
                    switch (obj.FilterSeg) {
                        case 'Empty':
                            // If FilterSeg is "Empty" determine emptiness by the following function
                            if (section.getControl('QuantitativeValue').visible) {
                                return section.getControl('QuantitativeValue').getValue().length === 0 ? true : false;
                            } else if (section.getControl('QualitativeValueSegment').visible) {
                                return libVal.evalIsEmpty(section.getControl('QualitativeValueSegment').getValue()[0]) ? false : true;
                            } else if (section.getControl('QualitativeValue').visible) {
                                return libVal.evalIsEmpty(section.getControl('QualitativeValue').getValue()[0]) ? false : true;
                            }
                            return false;
                        case 'Error':
                            // If FilterSeg is "Error" determine if section is in error by checking if any control has its validation view shown
                            return section.getControls().some(control => control._control._validationProperties.ValidationViewIsHidden === undefined ? false : !control._control._validationProperties.ValidationViewIsHidden) ? 'true' : 'false';
                        default:
                            // Default: show section
                            return 'true';
                    }
                } else if (obj.Equipment) {
                    let equipId = (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Checklist.global').getValue()) && sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.Equipment:sectionBinding.InspectionPoint_Nav.EquipNum;
                    return equipId === obj.Equipment;
                } else if (obj.Operations) {
                    let operationNum = (sectionBinding.EAMChecklist_Nav) ? sectionBinding.EAMChecklist_Nav.OperationNo : sectionBinding.InspectionPoint_Nav.OperationNo;
                    return operationNum === obj.Operations;
                } else {
                    // If nothing matches, return false
                    return true;
                }
            });
            // Evaluate newFilter as boolean expression, since all equivalency statements have been evaluated above
            if (libVal.evalIsEmpty(newFilter)) {
                newFilter = '(true)';
            }
            if (newFilter === '(true)') {
                resultsCount = resultsCount + 1;
            }
            context.evaluateTargetPathForAPI('#Page:CreateUpdatePage').setCaption(context.localizeText('record_results_x', [resultsCount]));
            section.setVisible(evaluateBooleanExpression(newFilter));
        }
    });

}
