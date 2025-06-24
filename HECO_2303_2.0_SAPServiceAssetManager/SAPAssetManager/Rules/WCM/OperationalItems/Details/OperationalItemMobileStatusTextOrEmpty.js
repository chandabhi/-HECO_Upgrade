import libVal from '../../../Common/Library/ValidationLibrary';

export default function OperationalItemMobileStatusTextOrEmpty(context) {
    return GetMobileStatusLabelOrNull(context, context.binding)
        .then(labelOrNull => labelOrNull || '');
}

export function GetMobileStatusLabelOrNull(context, wcmDocmuentItem) {
    return (wcmDocmuentItem.PMMobileStatus ? Promise.resolve(wcmDocmuentItem.PMMobileStatus) : GetWCMDocumentItemMobileStatus(context, wcmDocmuentItem))
        .then(pmMobileStatus => pmMobileStatus ? GetWCMDocItemMobileStatusLabel(context, pmMobileStatus.MobileStatus) : null);
}

export function GetWCMDocumentItemMobileStatus(context, wcmDocumentItem) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', wcmDocumentItem['@odata.readLink'] + '/PMMobileStatus', [], '')
        .then(pmMobileStatus => libVal.evalIsEmpty(pmMobileStatus) ? null : pmMobileStatus.getItem(0));  // single element is expected
}

export function GetWCMDocItemMobileStatusLabel(context, pmMobileStatusCode) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MobileStatusMappings', [], `$filter=ObjectType eq 'WCMDOCITEM' and MobileStatus eq '${pmMobileStatusCode}'`)
        .then(mobileStatusMappings => libVal.evalIsEmpty(mobileStatusMappings) ? null : mobileStatusMappings.getItem(0).MobileStatusLabel);
}
