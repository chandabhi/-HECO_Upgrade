export default function getTranslatedPersonaValue(context, userPersona) {
    let personasArray = [
        {
            userPersona: context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FSTPersonaName.global').getValue(),
            translatedPersonaName: context.localizeText('field_service'),
        },
        {
            userPersona: context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/IMPersonaName.global').getValue(),
            translatedPersonaName: context.localizeText('inventory_clerk'),
        },
        {
            userPersona: context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue(),
            translatedPersonaName: context.localizeText('maintenance_technician'),
        },
        {
            userPersona: context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/WCMPersonaName.global').getValue(),
            translatedPersonaName: context.localizeText('safety_technician'),
        },
    ];

    let currentPersona = personasArray.find(persona => persona.userPersona === userPersona);
    if (currentPersona) {
        return currentPersona.translatedPersonaName;
    }
    return '';
}
