import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';

export default function IsServiceItem(context) {
    let isServiceItem = false;
    let serviceItemCategories = S4ServiceLibrary.getServiceProductItemCategories(context);

    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceItem') {
        if (context.binding.ItemCategory_Nav) {
            isServiceItem = serviceItemCategories.includes(context.binding.ItemCategory_Nav.ObjectType);
        } else if (context.binding.ItemObjectType) {
            isServiceItem = serviceItemCategories.includes(context.binding.ItemObjectType);
        }
    } else if (context.binding && context.binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmationItem') {
        if (context.binding.ItemCategory) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', `ServiceItemCategories('${context.binding.ItemCategory}')`, ['ObjectType'],  '').then(result => {
                if (result.length) {
                    isServiceItem = serviceItemCategories.includes(result.getItem(0).ObjectType);
                }
                return isServiceItem;
            });
        }
    }

    return Promise.resolve(isServiceItem);
}
