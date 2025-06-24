import GetRelatedWorkOrdersData from './GetRelatedWorkOrdersData';
import IsPlantStandardModel from '../Common/IsPlantStandardModel';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function RelatedWorkOrdersTarget(context) {
    const isStandardModel = context.getClientData().isStandardModel;
    const cachedResult = context.getClientData().cachedResult;
    const binding = context.getPageProxy().binding;
    const cachedResultIsEmpty = ValidationLibrary.evalIsEmpty(cachedResult);

    return (ValidationLibrary.evalIsEmpty(isStandardModel) ? IsPlantStandardModel(context, binding.PlanningPlant) : Promise.resolve(isStandardModel)).then((isStandard) => {
        context.getClientData().isStandardModel = isStandard;

        return (ValidationLibrary.evalIsEmpty(cachedResult) ? GetRelatedWorkOrdersData(context, isStandard) : Promise.resolve(cachedResult)).then((data) => {
            if (cachedResultIsEmpty) {
                if (CommonLibrary.getPageName(context) === 'WCMRelatedWorkOrdersListViewPage') {
                    context.getPageProxy().setCaption(context.localizeText('work_order_x', [data.length]));
                }
                context.getClientData().cachedResult = data;
            }

            const result = data;
            if (context.searchString) {
                const search = context.searchString.toLowerCase();

                return result.filter((item) => {
                    return item.OrderId.toLowerCase().includes(search) || 
                        item.OrderDescription.toLowerCase().includes(search) || 
                        item.WOPriority.PriorityDescription.toLowerCase().includes(search);
                });
            }
            return result;
        });
    });
}
