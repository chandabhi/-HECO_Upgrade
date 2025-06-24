import PhaseControlVisible from '../PhaseControl/PhaseControlVisible';
import Logger from '../../Log/Logger';
import libPhase from '../../PhaseModel/PhaseLibrary';

export default function WorkOrderOperationSubPhase(context) {
    return libPhase.isPhaseModelActiveInDataObject(context, context.binding).then(isPhaseOrder => { //Only display if phase order type
        if (isPhaseOrder && PhaseControlVisible(context) && context.binding) {
            return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + '/OperationMobileStatus_Nav/OverallStatusCfg_Nav', ['SubphaseDesc'], '').then(result => {
                if (result.length) {
                    return result.getItem(0).SubphaseDesc;
                } else {
                    return '';
                }
            }).catch((error) => {
                Logger.error('EAMOverallStatusConfigs', error);
                return '';
            });
        }
        return '';
    });
}
