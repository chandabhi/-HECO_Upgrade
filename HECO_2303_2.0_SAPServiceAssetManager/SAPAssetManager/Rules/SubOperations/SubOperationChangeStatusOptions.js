import mobileStatusOverride from '../MobileStatus/MobileStatusUpdateOverride';
import common from '../Common/Library/CommonLibrary';
import {GlobalVar} from '../Common/Library/GlobalCommon';
import libSubOpMobile from './MobileStatus/SubOperationMobileStatusLibrary';
import MobileStatusLibrary from '../MobileStatus/MobileStatusLibrary';
import libSuper from '../Supervisor/SupervisorLibrary';
import personaLib from '../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';

export default function SubOperationChangeStatusOptions(context) {
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());

    /**
     * Checks for supervisor feature enablement and returns role if applicable
     * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
     */
    let roleCheck = function() {
        const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);
        const auth_supervisor = common.getAppParam(context, 'USER_AUTHORIZATIONS', 'SupervisorRole');
        const user = GlobalVar.getUserSystemInfo().get('PERNO');

        if (supervisorEnabled) {
            switch (auth_supervisor) {
                case 'Y': // Supervisor role set in config panel
                    return Promise.resolve('S');
                case 'N': // Technician role set in config panel
                    return Promise.resolve('T');
                default: // Role not set in config panel. Check data
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', [], `$filter=PersonnelNo eq '${user}'`).then(function(results) {
                        if (results && results.length > 0) {
                            return results.getItem(0).Role;
                        }
                        // If role cannot be found, assume supervisor
                        return 'S';
                    });
            }
        } else {
            // Supervisor isn't enabled
            return Promise.resolve('S');
        }
    };

    const assnType = common.getWorkOrderAssignmentType(context);
    // If operation level assignment, only allow confirm/unconfirm. Otherwise, do the whole mobile status shebang.
    if (assnType !== '3') {
        let operationMobileStatus = MobileStatusLibrary.getMobileStatus(context.binding.WorkOrderOperation, context);
        let headerMobileStatus = MobileStatusLibrary.getMobileStatus(context.binding.WorkOrderOperation.WOHeader, context);
        if (operationMobileStatus === STARTED || headerMobileStatus === STARTED) {
            return MobileStatusLibrary.isMobileStatusConfirmed(context, context.binding.SubOperationNo).then(result => {
                if (result) {
                    return [{'Title': context.localizeText('unconfirm'), 'OnPress': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationUnconfirmStatus.js'}];
                } else {
                    return [{'Title': context.localizeText('confirm'), 'OnPress': '/SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationCompleteStatus.js'}];
                }
            });
        }
        context.dismissActivityIndicator();
        return Promise.resolve();
    } else {
        return Promise.all([libSubOpMobile.isAnySubOperationStarted(context), roleCheck()]).then(checks => {
            const anythingStarted = checks[0];
            const userRoleType = checks[1];
            let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$filter=UserPersona eq '${personaLib.getActivePersona(context)}'&$expand=NextOverallStatusCfg_Nav`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/SubOpMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav`, [], queryOptions).then(codes => {
                let popoverItems = [];

                // Go through each available next status and create a PopoverItems array
                codes.forEach(element => {
                    let statusElement = element.NextOverallStatusCfg_Nav;
                    if (statusElement) {
                        let transitionText;

                        // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                        if (statusElement.TransitionTextKey) {
                            transitionText = context.localizeText(statusElement.TransitionTextKey);
                        } else {
                            transitionText = statusElement.OverallStatusLabel;
                        }

                        // Add items to possible transitions list
                        if (statusElement.MobileStatus === COMPLETE && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))) {
                            // Prepend warning dialog to complete status change
                            popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/SubOperations/NavOnCompleteSubOperationPage.js'});
                        } else if (statusElement.MobileStatus === TRANSFER && (element.RoleType === userRoleType || !libSuper.isSupervisorFeatureEnabled(context))) {
                            // Prepend warning dialog to transfer status change
                            popoverItems.push({'Title': transitionText, 'OnPress': {
                                'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
                                'Properties': {
                                    'Title': context.localizeText('confirm_status_change'),
                                    'Message': context.localizeText('transfer_suboperation'),
                                    'OKCaption': context.localizeText('ok'),
                                    'CancelCaption': context.localizeText('cancel'),
                                    'OnOK': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationTransferNav.action',
                                },
                            }});
                        } else {
                            // Add all other items to possible transitions as-is
                            // Omit Started if other work orders have been started
                            // Omit statuses not relevant to current role
                            if (!(statusElement.MobileStatus === STARTED && anythingStarted) && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))) {
                                popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'SubOpMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/SubOperationMobileStatusPostUpdate.js')});
                            }
                        }
                    }
                    
                });

                // Supervisor Mode: allow tech to back up to STARTED if work order is in REVIEW and status is local
                return context.read('/SAPAssetManager/Services/AssetManager.service', 'EAMOverallStatusConfigs', [], `$filter=MobileStatus eq '${STARTED}' and NextOverallStatusSeq_Nav/any(seq : seq/RoleType eq 'T') and ObjectType eq 'WO_OPERATION'`).then((results) => {
                    if (userRoleType === 'T' && context.binding.SubOpMobileStatus_Nav.MobileStatus === REVIEW && results.length > 0 && context.binding.SubOpMobileStatus_Nav['@sap.isLocal']) {
                        popoverItems.push({'Title': results.getItem(0).TransitionTextKey, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/SubOperations/NavOnCompleteSubOperationPage.js'});
                    }

                    if (popoverItems.length > 0) {
                        return popoverItems;
                    } else {
                        return Promise.resolve([]);
                    }
                });
            });
        });
    }
}
