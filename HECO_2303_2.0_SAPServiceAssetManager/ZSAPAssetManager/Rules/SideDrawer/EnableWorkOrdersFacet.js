import PersonaLibrary from '../Persona/PersonaLibrary';

export default function EnableWorkOrdersFacet(context) {
    return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isWCMOperator(context);
}
