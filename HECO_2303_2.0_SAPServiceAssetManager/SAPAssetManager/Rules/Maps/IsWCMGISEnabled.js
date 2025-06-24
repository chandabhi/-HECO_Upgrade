import userFeaturesLib from '../UserFeatures/UserFeaturesLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function IsWCMGISEnabled(context) {
    if (PersonaLibrary.isWCMOperator(context)) {
        return userFeaturesLib.isFeatureEnabled(context,context.getGlobalDefinition('/SAPAssetManager/Globals/Features/GIS.global').getValue());
    }
    return false;
}
