/**
* Show/Hide Take Reading button based on User Authorization and PM_MEASUREMENT feature
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
import IsS4ServiceIntegrationEnabled from '../../ServiceOrders/IsS4ServiceIntegrationEnabled';
import PersonaLibrary from '../../Persona/PersonaLibrary';

export default function EnableMeasurementCreate(context) {
    if (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.MD.Create') === 'Y') {
        if (IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context)) { 
            return true;
        }
        if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PRT.global').getValue())) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/WorkOrderTool', [], '').then(function(result) {
				if (result.length>0 &&result.getItem(0)) {
                    return true;
                } else {
                    return userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue());
                }

			});
        }        else if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMMeasurement.global').getValue())) {
            return true;
        }  else {
            return false;
        }
    } else {
        return false;
    }
}
