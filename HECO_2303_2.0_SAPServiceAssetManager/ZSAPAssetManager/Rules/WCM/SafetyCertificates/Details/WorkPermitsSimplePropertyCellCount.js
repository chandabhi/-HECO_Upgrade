
export default function WorkPermitsSimplePropertyCellCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/WCMApplicationDocuments`, [], '');
}
