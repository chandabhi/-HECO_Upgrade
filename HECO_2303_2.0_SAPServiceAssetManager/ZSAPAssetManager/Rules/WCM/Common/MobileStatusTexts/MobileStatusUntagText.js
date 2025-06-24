import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function MobileStatusUntagText(context) {
    return GetMobileStatusLabelOrEmpty(context, context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WCM/UntagParameterName.global').getValue());
}

export function GetMobileStatusLabelOrEmpty(context, mobileStatus) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MobileStatusMappings', [], `$filter=MobileStatus eq '${mobileStatus}'&$select=MobileStatusLabel`)
        .then(pmMobileStatus => ValidationLibrary.evalIsEmpty(pmMobileStatus) ? '' : pmMobileStatus.getItem(0).MobileStatusLabel);  // single element is expected
}
