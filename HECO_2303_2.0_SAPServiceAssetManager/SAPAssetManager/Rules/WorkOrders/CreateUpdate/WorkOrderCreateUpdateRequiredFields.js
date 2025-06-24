import { WorkOrderLibrary as libWo } from '../WorkOrderLibrary';

export default function WorkOrderCreateUpdateRequiredFields(context) {
    let requiredFields = [
        'DescriptionNote',
        'PlanningPlantLstPkr',
        'TypeLstPkr',
        'MainWorkCenterLstPkr',
    ];

    if (context.evaluateTargetPathForAPI('#Control:PrioritySeg').getVisible()) {
        requiredFields.push('PrioritySeg');
    } else {
        requiredFields.push('PriorityLstPkr');
    }

    return libWo.isSoldPartyRequired(context).then((required) => {
        if (required) {
            requiredFields.push('SoldToPartyLstPkr');
        }
        return requiredFields;
    });
}
