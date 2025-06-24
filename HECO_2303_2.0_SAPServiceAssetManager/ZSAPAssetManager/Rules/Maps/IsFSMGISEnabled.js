import PersonaLibrary from '../Persona/PersonaLibrary';
import IsGISEnabled from './IsGISEnabled';

export default function IsFSMGISEnabled(context) {
    if (PersonaLibrary.isFieldServiceTechnician(context)) {
        return IsGISEnabled(context);
    }
    return false;
}
