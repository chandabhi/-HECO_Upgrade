import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetMaterialGroup(context) {
    let materialLink = PurchaseRequisitionLibrary.getControlValue(context, 'MaterialListPicker');
    let group = '';

    if (materialLink) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', materialLink, [], '$expand=Material').then(result => {
            if (result && result.length) {
                let sloc = result.getItem(0);
                return sloc.Material ? sloc.Material.MaterialGroup : group;
            }

            return group;
        });
    }

    return group;
}
