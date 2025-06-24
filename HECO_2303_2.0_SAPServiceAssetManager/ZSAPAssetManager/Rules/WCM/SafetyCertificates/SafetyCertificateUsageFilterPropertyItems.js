import libComm from '../../Common/Library/CommonLibrary';

export default function SafetyCertificateUsageFilterPropertyItems(context) {
    const planningPlant = libComm.getUserDefaultPlanningPlant();
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WCMDocumentUsages', [], `${planningPlant ? `$filter=PlanningPlant eq '${planningPlant}'&` : ''}$select=Usage,UsageDescription`).then(results => {
        return {
            name: 'Usage',
            values: Array.from(results, r => ({
                ReturnValue: r.Usage,
                DisplayValue: r.UsageDescription,
            })),
        };
    });
}
