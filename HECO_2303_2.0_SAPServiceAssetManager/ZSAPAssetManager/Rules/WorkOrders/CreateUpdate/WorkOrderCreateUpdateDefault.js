import libCommon from '../../Common/Library/CommonLibrary';
import assnType from '../../Common/Library/AssignmentType';
import { WorkOrderLibrary } from '../WorkOrderLibrary';

function getDefaultValue(controlName) {
    let controlDefs = assnType.getWorkOrderAssignmentDefaults();
    return controlDefs[controlName].default;
}

export default function WorkOrderCreateUpdateDefault(control) {
    let controlName = control.getName();
    let context = control.getPageProxy();
    const myWOHeader = context.binding;
    const onCreate = libCommon.IsOnCreate(context);
    const fromPreviousWO = WorkOrderLibrary.getFollowUpFlag(context) && WorkOrderLibrary.getFollowOnFlag(context);

    if (onCreate && fromPreviousWO || !onCreate) {  // creating a new order from the previous or update previous - prepopulate fields
        switch (controlName) {
            case 'BusinessAreaLstPkr':
                return myWOHeader.BusinessArea;
            case 'TypeLstPkr':
                return myWOHeader.OrderType;
            case 'MainWorkCenterLstPkr':
                return myWOHeader.MainWorkCenter;
            case 'WorkCenterPlantLstPkr':
                return myWOHeader.MainWorkCenterPlant;
            case 'PlanningPlantLstPkr':
                return myWOHeader.PlanningPlant;
            case 'DescriptionNote':
                return onCreate ? '' : myWOHeader.OrderDescription;  // new order mustn't inherit previous' description
            default:
                return '';
        }
    }
    switch (controlName) {  // creating a new order with default values - no follow-up
        case 'TypeLstPkr':
            return '';
        case 'MainWorkCenterLstPkr':
            return libCommon.getStateVariable(context, 'WODefaultMainWorkCenter') || getDefaultValue('MainWorkCenter');
        case 'WorkCenterPlantLstPkr':
            return libCommon.getStateVariable(context, 'WODefaultWorkCenterPlant') || getDefaultValue('WorkCenterPlant');
        case 'PlanningPlantLstPkr':
            return libCommon.getStateVariable(context, 'WODefaultPlanningPlant') || getDefaultValue('PlanningPlant');
        case 'DescriptionNote':
            return myWOHeader && myWOHeader.OrderDescription || '';
        default:
            return '';
    }
}
