import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import personalLib from '../Persona/PersonaLibrary';

export default function IsGISEnabled(context) {
    return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue()) 
        && !(IsS4ServiceIntegrationEnabled(context) && personalLib.isFieldServiceTechnician(context));
}
