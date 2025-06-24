import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function FLOCHierarchyListPickerQueryOptions(controlProxy) {
    let context;
    try {
        context = controlProxy.getPageProxy();
    } catch (err) {
        controlProxy = controlProxy.binding.clientAPI;
        context = controlProxy.getPageProxy();
    }

    let planningPlantControlValue = CommonLibrary.getControlValue(CommonLibrary.getControlProxy(context, 'MaintenacePlantLstPkr'));
    let planningPlant = planningPlantControlValue || context.binding.PlanningPlant || context.binding.MaintPlant || '';
    let result = '$orderby=FuncLocId';
    
    if (planningPlant) {
        result += `&$filter=(PlanningPlant eq '' or PlanningPlant eq '${planningPlant}')`;
    } else {
        result += '&$filter=true';
    }

    return Promise.resolve(result);
}
