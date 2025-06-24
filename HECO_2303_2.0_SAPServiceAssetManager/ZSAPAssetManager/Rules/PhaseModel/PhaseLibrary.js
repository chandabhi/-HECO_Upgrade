import SupervisorLibrary from '../Supervisor/SupervisorLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';

export default class PhaseLibrary {

    static isPhaseModelActiveInDataObject(context, dataObject) {
        if (!dataObject) return Promise.resolve(false);

        let type = dataObject.OrderType || (dataObject.WOHeader ? dataObject.WOHeader.OrderType : '');
        if (type) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'OrderTypes', [], `$filter=PhaseModelActive eq 'X' and OrderType eq '${type}'`).then(result => {
                return result && !!result.length;
            });
        }

        return Promise.resolve(false);
    }

    static isSupervisorStatus(status) {
        return status && status.RoleType === 'S';
    }

    static supervisorStatusChangeAllowed(context, status) {
        if (SupervisorLibrary.isUserSupervisor(context)) {
            return IsPhaseModelEnabled(context) && PhaseLibrary.isSupervisorStatus(status);
        }

        return false;
    }
}
