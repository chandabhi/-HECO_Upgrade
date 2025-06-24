import PersonaLibrary from '../Persona/PersonaLibrary';

export default function EnableForTechniciansAndWCM(context) {
    return PersonaLibrary.isMaintenanceTechnician(context) || PersonaLibrary.isFieldServiceTechnician(context) || PersonaLibrary.isWCMOperator(context);
}
