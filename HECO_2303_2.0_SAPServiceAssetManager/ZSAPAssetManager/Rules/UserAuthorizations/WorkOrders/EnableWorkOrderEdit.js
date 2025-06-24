/**
* Show/Hide Work Order edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import libMobileStatus from '../../MobileStatus/MobileStatusLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import Logger from '../../Log/Logger';
import libPersona from '../../Persona/PersonaLibrary';

export default function EnableWorkOrderEdit(context, customBinding) {
    let binding = customBinding || context.binding;
    if (libPersona.isWCMOperator(context)) {
        return Promise.resolve(false);
    }
    if (binding && !binding['@odata.type'] && context.getActionBinding) {
        binding = context.getActionBinding();
    }
    if (libVal.evalIsEmpty(binding)) {
        return Promise.resolve(EnableOrLocal(context));
    }
    return libSuper.isBusinessObjectEditable(context).then(editable => {
        if (!editable) {
            return false; //Supervisor is enabled, user is a tech, work center assignments and this work order is not assigned to this user
        }
        switch (binding['@odata.type']) {
            case '#sap_mobile.S4ServiceOrder':
            case '#sap_mobile.S4ServiceRequest':
            case '#sap_mobile.MyWorkOrderHeader':
                return IsMyWorkOrderHeaderEditable(context, binding);
            case '#sap_mobile.MyWorkOrderOperation':
                return IsMyWorkOrderOperationEditable(context, binding);
            case '#sap_mobile.MyWorkOrderSubOperation':
                return IsMyWorkOrderSubOperationEditable(context, binding);
            default:
                return EnableOrLocal(context);
        }
    });
}

function EnableOrLocal(context) {
    return !!(libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.WO.Edit') === 'Y' || libCom.isCurrentReadLinkLocal(context.binding['@odata.readLink']));
}

function IsCompleted(context, mStatus) {
    return ['/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global',
        '/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global',
        '/SAPAssetManager/Globals/MobileStatus/ParameterNames/RejectedParameterName.global',
        '/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global']
        .map(globalDefPath => libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition(globalDefPath).getValue()))
        .includes(mStatus);  // is mobile status completed, reviewed or rejected
}

function IsMyWorkOrderHeaderEditable(context, myWorkOrderHeader) {
    let mStatus;
    try {
        mStatus = libMobileStatus.getMobileStatus(myWorkOrderHeader, context);
    } catch (err) {
        Logger.error(`Failed to get mobile status: ${err}`);
    }
    return mStatus ? (EnableOrLocal(context) && !IsCompleted(context, mStatus)) : EnableOrLocal(context);
}

function IsMyWorkOrderSubOperationEditable(context, myWorkOrderSubOperation) {
    if (libMobileStatus.isSubOperationStatusChangeable()) {
        return (EnableOrLocal(context) && !IsCompleted(context, libMobileStatus.getMobileStatus(myWorkOrderSubOperation, context)));
    }
    return libMobileStatus.isMobileStatusConfirmed(context, myWorkOrderSubOperation.SubOperationNo, myWorkOrderSubOperation)
        .then(isConfirmed => isConfirmed ? false : EnableOrLocal(context));
}

export function IsMyWorkOrderOperationEditable(context, myWorkOrderOperation) {
    return libMobileStatus.isMobileStatusComplete(context, 'MyWorkOrderHeaders', myWorkOrderOperation.OrderId, '', true).then(isMobStatusComplete => {
        if (isMobStatusComplete) { //already complete so exit
            return false;
        }
        if (libMobileStatus.isOperationStatusChangeable(context)) {
            return EnableOrLocal(context) && !IsCompleted(context, libMobileStatus.getMobileStatus(myWorkOrderOperation, context));
        }
        return libMobileStatus.isMobileStatusConfirmed(context, '', myWorkOrderOperation)
            .then(isConfirmed => isConfirmed ? false : EnableOrLocal(context));
    });
}
