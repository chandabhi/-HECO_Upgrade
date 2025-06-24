import libCommon from '../../Common/Library/CommonLibrary';

export default function DefaultDescriptionValue(context) {
    const onCreate = libCommon.IsOnCreate(context);
    const data = context.binding;

    if (!onCreate && data && data.Material && data.Plant && data.StorageLocation) {
        let material = `MaterialSLocs(MaterialNum='${data.Material}',Plant='${data.Plant}',StorageLocation='${data.StorageLocation}')`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', material, [], '$expand=Material,MaterialPlant/MaterialValuation_Nav').then(result => {
            if (result && result.length > 0) {
                let materialSLoc = result.getItem(0);
                return materialSLoc.Material ? materialSLoc.Material.Description : '';
            }
            return null;
        });
    }

    return null;
}
