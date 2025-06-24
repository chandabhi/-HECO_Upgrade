import IsSupervisorEnableWorkOrderEdit from './IsSupervisorEnableWorkOrderEdit';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';

export default function IsSupervisorEnableWorkOrderEditOperationsWrapper(context) {
    let binding = context.binding;

    if (binding) {
        if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderHeader') { //Do not allow adding operations from work order detail operations list if order is phase enabled
            return PhaseLibrary.isPhaseModelActiveInDataObject(context, binding).then((phaseEnabled) => {
                if (phaseEnabled) {
                    return false;
                }
                return IsSupervisorEnableWorkOrderEdit(context);
            });
        }
    }
    return IsSupervisorEnableWorkOrderEdit(context);
}
