import mobileStatusOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import libCom from '../../Common/Library/CommonLibrary';
import libSuper from '../../Supervisor/SupervisorLibrary';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import libWOMobile from './WorkOrderMobileStatusLibrary';
import isAssignEnableWorkOrder from '../MobileStatus/IsAssignEnableWorkOrder';
import isUnAssignOrReAssignEnableWorkOrder from '../MobileStatus/IsUnAssignOrReAssignEnableWorkOrder';
import personaLib from '../../Persona/PersonaLibrary';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';
import PhaseLibrary from '../../PhaseModel/PhaseLibrary';
import WorkOrderCompletionLibrary from '../Complete/WorkOrderCompletionLibrary';
import { WorkOrderLibrary as libWO } from '../WorkOrderLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import libVal from '../../Common/Library/ValidationLibrary';

/**
 * Populates the Work Order Mobile Status popover
 * Popover items use MDK overrides to run associated update dialogs/actions
 * @param {IClientAPI} context MDK context (likely a toolbar item)
 * @returns {Promise<Object>} unknown
 */
export default function WorkOrderChangeStatusOptions(context) {
    const cicoEnabled = libClock.isCICOEnabled(context);
    const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const COMPLETE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());
    const REVIEW = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const HOLD = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const APPROVE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ApproveParameterName.global').getValue());
    const DISAPPROVE = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/DisapproveParameterName.global').getValue());
    const WORKCOMPLETED = context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/WorkCompletedParameterName.global').getValue();
    libCom.removeStateVariable(context, 'MobileStatusSaveRequired');
    libCom.removeStateVariable(context, 'MobileStatusReadLinkSaveRequired');

    /**
     * Checks for supervisor feature enablement and returns role if applicable
     * @returns {Promise<String>} 'T' if Technician, 'S' if Supervisor or feature disabled
     */
    let roleCheck = function() {
        const supervisorEnabled = libSuper.isSupervisorFeatureEnabled(context);

        if (supervisorEnabled) {
            return libSuper.isUserTechnician(context).then(isTechnician => {
                if (isTechnician) {
                    return 'T';
                }
                return 'S';
            });
        } else {
            // Supervisor isn't enabled
            return Promise.resolve('S');
        }
    };

    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceOrder') {
        return Promise.all([
            S4ServiceLibrary.isAnythingStarted(context),
            roleCheck(),
            libSuper.checkReviewRequired(context, context.binding),
        ]).then(checks => {
            let check = {
                isAnythingStarted: checks[0],
                currentRole: checks[1],
                isReviewRequired: checks[2],
            };
            return S4ServiceLibrary.getAvailableStatuses(context, context.binding, check);
        });
    }

    if (context.binding['@odata.type'] === '#sap_mobile.S4ServiceRequest') {
        return Promise.all([
            roleCheck(),
            libSuper.checkReviewRequired(context, context.binding),
        ]).then(checks => {
            let check = {
                currentRole: checks[0],
                isReviewRequired: checks[1],
            };
            return S4ServiceLibrary.getAvailableStatusesServiceRequest(context, context.binding, check);
        });
    }

    return Promise.all([libWOMobile.isAnyWorkOrderStarted(context), roleCheck(), PhaseLibrary.isPhaseModelActiveInDataObject(context, context.binding)]).then(checks => {
        const anythingStarted = checks[0];
        const userRoleType = checks[1];
        const isPhaseModelActiveInDataObject = checks[2];

        // Return empty list for Work Orders without mobile status
        if (libVal.evalIsEmpty(context.binding.OrderMobileStatus_Nav)) {
            return Promise.resolve([]);
        }

        const mobileStatus = context.binding.OrderMobileStatus_Nav.MobileStatus;
        const statusIsLocal = context.binding.OrderMobileStatus_Nav['@sap.isLocal'];
        const isClockedIn = (libClock.isBusinessObjectClockedIn(context) && libClock.allowClockInOverride(context, mobileStatus));
        let entitySet = context.binding['@odata.readLink'] + '/OrderMobileStatus_Nav/OverallStatusCfg_Nav/OverallStatusSeq_Nav';
        let queryOptions = IsPhaseModelEnabled(context) ? '$expand=NextOverallStatusCfg_Nav' : `$expand=NextOverallStatusCfg_Nav&$filter=UserPersona eq '${personaLib.getActivePersona(context)}'`;

        if (isClockedIn && mobileStatus !== STARTED) { //User is clocked in, but mobile status is not STARTED because another user has changed it.  We will use the next available statuses for STARTED
            entitySet = 'EAMOverallStatusSeqs';
            let baseQuery = "OverallStatusCfg_Nav/MobileStatus eq 'STARTED' and OverallStatusCfg_Nav/ObjectType eq 'WORKORDER'";
            if (IsPhaseModelEnabled(context)) {
                queryOptions = '$expand=NextOverallStatusCfg_Nav&$filter=' + baseQuery;
            } else {
                queryOptions = "$expand=NextOverallStatusCfg_Nav&$filter=UserPersona eq '" + personaLib.getActivePersona(context) + "' and "+ baseQuery;
            }
        }

        //If CICO enabled, current Work Order is started by someone else, and nothing is clocked in, do not transition; clock in immediately
        if (!anythingStarted && mobileStatus === STARTED && (cicoEnabled && !isClockedIn)) {
            return [{'Title': context.localizeText('clock_in'), 'OnPress': '/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderDummyStatusToast.action'}];
        } else {
            return libSuper.checkReviewRequired(context, context.binding).then(review => {
                // Otherwise, populate possible transitions
                return context.read('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/OrderMobileStatus_Nav`, [], '$expand=OverallStatusCfg_Nav').then(rollback => {
                    libCom.setStateVariable(context, 'PhaseModelRollbackStatus', rollback.getItem(0)); //Save the rollback state to use if necessary
                    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(codes => {
                        const isWCMWorkOrder = libWO.isWCMWorkOrder(context);

                        let popoverItems = [];

                        // Go through each available next status and create a PopoverItems array
                        codes.forEach(element => {
                            let statusElement = element.NextOverallStatusCfg_Nav;
                            if (statusElement) {
                                let transitionText;
                                    
                                // If there is a TranslationTextKey available, use that for the popover item. Otherwise, use the OverallStatusLabel.
                                if (statusElement.TransitionTextKey) {
                                    if (cicoEnabled && statusElement.MobileStatus === STARTED) {
                                        transitionText = context.localizeText('clock_in');
                                    } else {
                                        transitionText = context.localizeText(statusElement.TransitionTextKey);
                                    }
                                } else {
                                    transitionText = statusElement.OverallStatusLabel;
                                }

                                // Add items to possible transitions list
                                if (statusElement.MobileStatus === APPROVE && element.RoleType === userRoleType) {
                                    let postUpdateRule;
                                    if (libSuper.isAutoCompleteOnApprovalEnabled(context)) {
                                        WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(context, true);
                                        postUpdateRule = '/SAPAssetManager/Rules/Supervisor/ApprovalPostUpdate.js';
                                    } else {
                                        postUpdateRule = '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js';
                                    }
                                    popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', postUpdateRule)});
                                } else if (statusElement.MobileStatus === DISAPPROVE && element.RoleType === userRoleType) {
                                    libCom.setStateVariable(context, 'PhaseModelStatusElement', statusElement);
                                    popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/Supervisor/Reject/RejectReasonPhaseModelNav.js'});
                                } else if (statusElement.MobileStatus === REVIEW && element.RoleType === userRoleType) {
                                    if (review) { //Review required for tech
                                        popoverItems.push({'Title': transitionText, 'OnPress':'/SAPAssetManager/Rules/WorkOrders/NavOnCompleteWorkOrderPage.js'});
                                    }
                                } else if (statusElement.MobileStatus === HOLD && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))) {
                                    // Prepend warning dialog to hold status change
                                    popoverItems.push({'Title': transitionText, 'OnPress': {
                                        'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                                        'Properties': {
                                            'Title': context.localizeText('confirm_status_change'),
                                            'CancelCaption': context.localizeText('cancel'),
                                            'OnOK': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js'),
                                        },
                                    }});
                                } else if (statusElement.MobileStatus === COMPLETE && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))) {
                                    // Check that complete action can be visible. For WCM WO completion is possible only from work completed status
                                    let isCompleteVisible = ((userRoleType === 'S' || (userRoleType === 'T' && !review)) && mobileStatus !== REVIEW) && (!isWCMWorkOrder || mobileStatus === WORKCOMPLETED);
                                    if (libSuper.isSupervisorFeatureEnabled(context) && userRoleType === 'S' && mobileStatus === DISAPPROVE && !statusIsLocal) {
                                        isCompleteVisible = false; //Supervisor can only transition from DISAPPROVE to COMPLETE if status change is local
                                    }
                                    if (isCompleteVisible) {
                                        // Prepend warning dialog to complete status change
                                        popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Rules/WorkOrders/NavOnCompleteWorkOrderPage.js'});
                                    }
                                } else if (statusElement.MobileStatus === TRANSFER && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context) || !libSuper.isSupervisorFeatureEnabled(context))) {
                                    // Prepend warning dialog to transfer status change
                                    popoverItems.push({'Title': transitionText, 'OnPress': '/SAPAssetManager/Actions/WorkOrders/WorkOrderTransferNav.action',
                                    });
                                } else if (statusElement.MobileStatus === WORKCOMPLETED && isWCMWorkOrder && element.RoleType === userRoleType) {
                                    popoverItems.push({'Title': transitionText, 'OnPress': {
                                        'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
                                        'Properties': {
                                            'Title': context.localizeText('confirm_status_change'),
                                            'Message': context.localizeText('change_wo_status_message', [transitionText]),
                                            'CancelCaption': context.localizeText('cancel'),
                                            'OnOK': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js'),
                                        },
                                    }});
                                } else {
                                    // Add all other items to possible transitions as-is
                                    // Omit Started if other work orders have been started
                                    // Omit statuses not relevant to current role
                                    if (!(statusElement.MobileStatus === STARTED && anythingStarted)
                                        && (element.RoleType === userRoleType || personaLib.isFieldServiceTechnician(context))
                                        && statusElement.MobileStatus !== APPROVE
                                        && statusElement.MobileStatus !== DISAPPROVE
                                        && statusElement.MobileStatus !== WORKCOMPLETED) {
                                        popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav', '/SAPAssetManager/Rules/MobileStatus/WorkOrderMobileStatusPostUpdate.js')});
                                    }

                                    if ((statusElement.MobileStatus === APPROVE || statusElement.MobileStatus === DISAPPROVE)
                                        && PhaseLibrary.supervisorStatusChangeAllowed(context, element) && isPhaseModelActiveInDataObject) {
                                            popoverItems.push({'Title': transitionText, 'OnPress': mobileStatusOverride(context, statusElement, 'OrderMobileStatus_Nav')});
                                        }
                                }
                            }

                        });

                        if (mobileStatus !== STARTED) { //Add supervisor role assignment options only if the workorder is not started (These are not data driven currently)
                            return Promise.all([isAssignEnableWorkOrder(context), isUnAssignOrReAssignEnableWorkOrder(context)]).then(assignResults => {
                                const assign = assignResults[0];
                                const unassign = assignResults[1];
    
                                if (assign) {
                                    popoverItems.push({'Title': context.localizeText('assign'), 'OnPress': '/SAPAssetManager/Rules/Supervisor/Assign/WorkOrderAssignNav.js'});
                                }
                                if (unassign) {
                                    popoverItems.push({'Title': context.localizeText('unassign'), 'OnPress': '/SAPAssetManager/Rules/Supervisor/UnAssign/WorkOrderUnAssignNav.js'});
                                    popoverItems.push({'Title': context.localizeText('reassign'), 'OnPress': '/SAPAssetManager/Rules/Supervisor/ReAssign/WorkOrderReAssignNav.js'});
                                }
    
                                return popoverItems;
                            });
                        } else {
                            return Promise.resolve(popoverItems);
                        }
                        
                        
                    });
                });
            });
        }
    });
}
