import EquipmentQueryOptions from './EquipmentQueryOptions';

export default function EquipmentCount(sectionProxy) {
    if (sectionProxy.getPageProxy().binding 
                        && (sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceOrder' 
                        || sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceRequest'
                        || sectionProxy.getPageProxy().binding['@odata.type'] === '#sap_mobile.S4ServiceConfirmation')) { 
        let countFromBinding = sectionProxy.binding ? sectionProxy.binding.length : 0;

        if (countFromBinding === undefined) {
            return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', EquipmentQueryOptions(sectionProxy)).then((count) => {
                sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
                return count;
            });  
        }

        return Promise.resolve(countFromBinding);
    }

    return sectionProxy.count('/SAPAssetManager/Services/AssetManager.service', 'MyEquipments', '').then((count) => {
        sectionProxy.getPageProxy().getClientData().EquipmentTotalCount = count;
        return count;
    });   
}
