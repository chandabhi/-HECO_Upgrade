import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function IsServiceReportEnabled(context) {
    if (!UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/ServiceReport.global').getValue())) {
        return false;
    }

    if (PersonaLibrary.isMaintenanceTechnician(context)) {
        return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue());
    } else {
        if (IsS4ServiceIntegrationEnabled(context)) {
            return true;
        } else {
            return UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceData.global').getValue());
        }
    }
}
