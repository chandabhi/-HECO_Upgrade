import UserFeaturesLibrary from '../UserFeatures/UserFeaturesLibrary';

export default function IsBusinessPartnerAddOptionsVisibile(context) {
    const type = context.getGlobalDefinition('/SAPAssetManager/Globals/S4Service/SoldToPartyType.global').getValue();
    let binding = context.getBindingObject();
    let parentFunrtionType = '';
    if (binding && binding.S4PartnerFunc_Nav) {
        parentFunrtionType = binding.S4PartnerFunc_Nav.PartnerFunction;
    }

    return parentFunrtionType && parentFunrtionType === type && 
        UserFeaturesLibrary.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/S4ServiceData.global').getValue());
}
