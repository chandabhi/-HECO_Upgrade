
export default function OperationalItemsStatusesFilter(context) {
    return GetMobileStatusMappingsByObjectType(context, 'WCMDOCITEM')
        .then(mobileStatusMappings => [...new Map(mobileStatusMappings.map(mobileStatusMapping => [mobileStatusMapping.MobileStatus, mobileStatusMapping])).values()]  // make the statuses unique
            .map(uniqueMobileStatusMapping => ({
                ReturnValue: uniqueMobileStatusMapping.MobileStatus,
                DisplayValue: uniqueMobileStatusMapping.MobileStatusLabel,
            })));
}

function GetMobileStatusMappingsByObjectType(context, objectType) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MobileStatusMappings', [], `$filter=ObjectType eq '${objectType}'`);
}
