import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsMTGISEnabled(context) {
    if (PersonaLibrary.isMaintenanceTechnician(context)) {
        return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
    }
    return false;
}
