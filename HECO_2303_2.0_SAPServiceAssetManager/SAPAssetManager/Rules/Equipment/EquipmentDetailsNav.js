import { EquipmentLibrary as libEquipment } from './EquipmentLibrary';
import Logger from '../Log/Logger';
import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';

export default function EquipmentDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionContext = pageProxy.getActionBinding();

    let queryOpts = libEquipment.equipmentDetailsQueryOptions();
    if (userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/AssetCentral.global').getValue())) {
        queryOpts = libEquipment.equipmentDetailsWithAssetCentralQueryOptions();
    }

    let entityset = actionContext['@odata.readLink'];
    if (actionContext['@odata.type'] === '#sap_mobile.S4ServiceOrderRefObj') {
        if (!actionContext.Equipment_Nav) return Promise.resolve();
        entityset = actionContext.Equipment_Nav['@odata.readLink'];
    }
    if (actionContext['@odata.type'] === '#sap_mobile.S4ServiceRequestRefObj') {
        if (!actionContext.MyEquipment_Nav) return Promise.resolve();
        entityset = actionContext.MyEquipment_Nav['@odata.readLink'];
    }
    //Rebind the necessary equipment data selected from the list
    return context.read('/SAPAssetManager/Services/AssetManager.service', entityset, [], queryOpts).then(Equipment => {
        pageProxy.setActionBinding(Equipment.getItem(0));
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action');
    }, error => {
        /**Implementing our Logger class*/
        Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryEquipment.global').getValue(), error);
    });
}
