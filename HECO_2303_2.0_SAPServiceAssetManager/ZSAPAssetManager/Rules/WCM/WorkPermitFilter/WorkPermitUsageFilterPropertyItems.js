import libComm from '../../Common/Library/CommonLibrary';

export default function WorkPermitUsageFilterPropertyItems(context) {
    const planningPlant = libComm.getUserDefaultPlanningPlant();
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMApplicationUsages', [], `${planningPlant ? `$filter=PlanningPlant eq '${planningPlant}'&` : ''}$select=Usage,DescriptUsage`).then(results => {
        return {
            name: 'Usage',
            values: Array.from(results, r => ({
                ReturnValue: r.Usage,
                DisplayValue: r.DescriptUsage,
            })),
        };
    });
}
