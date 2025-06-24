/**
* Show/Hide SubOperation Button
* @param {IClientAPI} context
*/
import EnableWorkOrderEdit from './EnableWorkOrderEdit';
import libPersona from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import libPhase from '../../PhaseModel/PhaseLibrary';

export default function EnableOperationCreate(context) {
    return EnableWorkOrderEdit(context).then(auth => {
        if (libPersona.isMaintenanceTechnician(context)) {
            let phaseEnabled = IsPhaseModelEnabled(context);
            if (phaseEnabled) {
                return libPhase.isPhaseModelActiveInDataObject(context, context.binding).then(phaseOrder => {
                    return auth && !phaseOrder; //Do not allow create operation if WO is phase enabled
                });
            }
            return auth;
        }
        return auth;
    });
}
