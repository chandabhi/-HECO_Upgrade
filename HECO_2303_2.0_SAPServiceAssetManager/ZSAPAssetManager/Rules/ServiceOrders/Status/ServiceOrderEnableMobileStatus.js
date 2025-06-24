import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libCommon from '../../Common/Library/CommonLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import S4ServiceLibrary from '../S4ServiceLibrary';

export default function ServiceOrderEnableMobileStatus(context) {
    //We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
    let isLocal = libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink']);
    if (isLocal) {
        if (!libCommon.isAppParameterEnabled(context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects')) {
            return Promise.resolve(false);
        }
    }

    if (libMobile.isServiceOrderStatusChangeable(context)) {
        const TRANSFERED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
        const COMPLETED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        const STARTED = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const REVIEW = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
        const DISAPPROVE = libCommon.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
        const mobileStatus = libMobile.getMobileStatus(context.binding, context);

        return libSuper.isBusinessObjectEditable(context).then(editable => {
            if (!editable) {
                return Promise.resolve(false); //Supervisor is enabled, user is a tech, work center assignments and this work order is not assigned to this user
            }

            if (mobileStatus === TRANSFERED || mobileStatus === COMPLETED || mobileStatus === 'D-COMPLETE') {
                return Promise.resolve(false);
            }

            if (mobileStatus === STARTED) {
                return Promise.resolve(true);
            }

            if (mobileStatus === REVIEW) {
                return libSuper.isUserSupervisor(context).then(isSupervisor => {
                    if (isSupervisor) { //Supervisor can approve
                        return Promise.resolve(true);
                    }
                    if (libSuper.isSupervisorFeatureEnabled(context)) {
                        if (context.binding.supervisorLocal) { //Tech can re-open a local review status object
                            return Promise.resolve(true);
                        }
                    }
                    return Promise.resolve(false); //Review status has been transmitted, or feature not enabled so cannot edit
                });
            }

            if (mobileStatus === DISAPPROVE) {
                return libSuper.isUserSupervisor(context).then(isSupervisor => {
                    if (isSupervisor) {
                        if (context.binding.supervisorLocal) { //Supervisor can approve a local rejection status before transmit
                            return Promise.resolve(true);
                        }
                        return Promise.resolve(false);
                    }
                    if (libSuper.isSupervisorFeatureEnabled(context)) {
                        return Promise.resolve(true); //Tech can start and correct
                    }
                    return Promise.resolve(false); //Feature not enabled so cannot edit
                });
            }

            return S4ServiceLibrary.isAnythingStarted(context).then(isAnyOrderStarted => {
                if (isAnyOrderStarted && libCommon.isCurrentReadLinkLocal(context.binding['@odata.readLink'])) {
                    return Promise.resolve(false);
                } else {
                    return Promise.resolve(true);
                }
            });
        });
    }

    return Promise.resolve(false);
}
