import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default function EnableTimeRecords(context) {
    return !IsS4ServiceIntegrationEnabled(context) && PersonaLibrary.isFieldServiceTechnician(context);
}
