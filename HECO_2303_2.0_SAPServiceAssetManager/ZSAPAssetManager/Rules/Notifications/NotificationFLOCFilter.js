import libCom from '../Common/Library/CommonLibrary';
import libVal from '../Common/Library/ValidationLibrary';
import { GlobalVar } from '../Common/Library/GlobalCommon';

export default function NotificationFLOCFilter(context) {
    if (context.binding['@odata.type'] === '#sap_mobile.InspectionCharacteristic') {
        return `$filter=FuncLocIdIntern eq '${context.binding.EAMChecklist_Nav.FunctionalLocation}'&$orderby=FuncLocId`;
    }
    const iwk = GlobalVar.getUserSystemInfo().get('USER_PARAM.IWK');
    const notificationAppParamPlant = libCom.getAppParam(context, 'NOTIFICATION', 'PlanningPlant');
    let notificationPlanningPlant = iwk || notificationAppParamPlant || '';

    const notificationPlanningPlantQuery = notificationPlanningPlant.split(',').map((plant) => `PlanningPlant eq '${plant}'`).join(' or ');
    
    if (!libVal.evalIsEmpty(notificationPlanningPlant)) {
        return `$orderby=FuncLocId&$filter=(PlanningPlant eq '' or ${notificationPlanningPlantQuery})`;
    } else {
        return '&$orderby=FuncLocId';
    }
}
