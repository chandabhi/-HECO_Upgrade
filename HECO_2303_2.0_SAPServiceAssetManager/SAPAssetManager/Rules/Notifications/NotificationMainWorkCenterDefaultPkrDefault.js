import libVal from '../Common/Library/ValidationLibrary';

export default function NotificationMainWorkCenterDefaultPkrDefault(context) {
    let binding = context.binding;
    if (libVal.evalIsEmpty(binding.MainWorkCenter)) {
        return null;
    }

    let filterQuery = `$filter=WorkCenterId eq '${binding.MainWorkCenter}' and ObjectType eq 'A'`;
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WorkCenters', [], filterQuery).then(function(result) {
        if (result && result.length > 0) {
            return result.getItem(0).ExternalWorkCenterId;
        }
        return null;
    });
}
