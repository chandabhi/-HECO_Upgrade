import generateGUID from '../../../SAPAssetManager/Rules/Common/guid';
import ODataDate from '../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import common from '../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';
import supervisor from '../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import noteWrapper from '../../../SAPAssetManager/Rules/Supervisor/MobileStatus/NoteWrapper';
import {ChecklistLibrary} from '../../../SAPAssetManager/Rules/Checklists/ChecklistLibrary';
import phaseModelEnabled from '../../../SAPAssetManager/Rules/Common/IsPhaseModelEnabled';
import libClock from '../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import libMobile from '../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import CompleteOperationMobileStatusAction from '../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import LocationUpdate from './../../../SAPAssetManager/Rules/MobileStatus/LocationUpdate';
import pdfAllowedForOperation from '../../../SAPAssetManager/Rules/PDF/IsPDFAllowedForOperation';
import mileageAddNav from '../../../SAPAssetManager/Rules/ServiceOrders/Mileage/MileageAddNav';
import expenseCreateNav from '../../../SAPAssetManager/Rules/Expense/CreateUpdate/ExpenseCreateNav';
import mobileStatusHistoryEntryCreate from './../../../SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryEntryCreate';
import ExpensesVisible from '../../../SAPAssetManager/Rules/ServiceOrders/Expenses/ExpensesVisible';
import MileageIsEnabled from '../../../SAPAssetManager/Rules/ServiceOrders/Mileage/MileageIsEnabled';
import PDFGenerateDuringCompletion from '../../../SAPAssetManager/Rules/PDF/PDFGenerateDuringCompletion';
import libAutoSync from '../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import userFeaturesLib from '../../../SAPAssetManager/Rules/UserFeatures/UserFeaturesLibrary';
import IsConfirmationEnabledOperation from '../Operations/IsConfirmationEnabledOperation';
import ToolbarRefresh from '../../../SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh';
import PhaseLibrary from '../../../SAPAssetManager/Rules/PhaseModel/PhaseLibrary';
import ZCISHoldStatus from '../Meter/HECO/ZCISHoldStatusUpdate';
import ZCISHoldStatusEnabled from '../Meter/HECO/ZCISHoldStatusEnabled';
import CurrentDateTime from "../../../SAPAssetManager/Rules/DateTime/CurrentDateTime";

function rollbackMobileStatus(context, mobileStatusEditLink, showBanner) {
    let actionObject = {
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'PMMobileStatuses',
                'EditLink': mobileStatusEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    };

    if (showBanner) {
        actionObject.OnSuccess = {
            'Name': '/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action',
            'Properties': {
                'Message': '$(L,assign_failure)',
            },
        };
    }
    return context.executeAction(actionObject).then(result => {
        try {
            return JSON.parse(result.data);
        } catch (exc) {
            return {};
        }
    });
}

function rollbackAssignment(context, assignmentEditLink) {
    return context.executeAction({
        'Name' : '/SAPAssetManager/Actions/Common/GenericDiscard.action',
        'Properties': {
            'Target': {
                'EntitySet': 'WorkOrderTransfers',
                'EditLink': assignmentEditLink,
                'Service': '/SAPAssetManager/Services/AssetManager.service',
            },
        },
    }).then(result => {
        try {
            return JSON.parse(result.data);
        } catch (exc) {
            return {};
        }
    });
}

function assignToSelf(context, binding, updateResult) {
    if (binding.PersonNum === '00000000') {
        let employee = common.getPersonnelNumber();
        return context.executeAction({
            'Name' : '/SAPAssetManager/Actions/MobileStatus/OperationSelfAssign.action',
            'Properties': {
                'Properties': {
                    'OperationNo': binding.OperationNo,
                    'OrderId': binding.OrderId,
                    'EmployeeTo': employee,
                },
            },
        }).then((selfAssign) => {
            selfAssign = JSON.parse(selfAssign.data);
            // Only attempt to upload Operation Transfer if device is online
            if (context.getPageProxy().nativescript.connectivityModule.getConnectionType() > 0) {
                // Upload the created WorkOrderTransfer record
                return context.executeAction('/SAPAssetManager/Actions/MobileStatus/OperationTransferUpload.action').then(() => {
                    // Check Error Archive to see if issues occurred during assignment
                    return context.read('/SAPAssetManager/Services/AssetManager.service', 'ErrorArchive', [], "$filter=RequestMethod eq 'POST' and RequestURL eq '/WorkOrderTransfers'").then(entries => {
                        if (entries.length === 0) {
                            // If no errors, re-download Operation and proceed to update toolbar
                            return context.executeAction({
                                'Name': '/SAPAssetManager/Actions/MobileStatus/OperationTransferDownload.action',
                                'Properties': {
                                    'DefiningRequests' : [{
                                        'Name': 'MyWorkOrderOperations',
                                        'Query': `$filter=OrderId eq '${binding.OrderId}' and OperationNo eq '${binding.OperationNo}'`,
                                    }],
                                },
                            }).then(() => {
                                // Update PersonNum so subsequent transitions don't trigger an upload
                                binding.PersonNum = employee;
                            });
                        } else {
                            // If errors occurred trying to assign operation, roll back Overall Status and delete all related ErrorArchive entries (normally should only be one)
                            let actionPromises = [];
                            entries.forEach(entry => {
                                actionPromises.push(context.executeAction({
                                    'Name' : '/SAPAssetManager/Actions/Common/ErrorArchiveDiscard.action',
                                    'Properties': {
                                        'OnSuccess': '',
                                        'OnFailure': '',
                                        'Target': {
                                            'EntitySet': 'ErrorArchive',
                                            'Service': '/SAPAssetManager/Services/AssetManager.service',
                                            'QueryOptions': `$filter=RequestID eq ${entry.RequestID}`,
                                        },
                                    },
                                }));
                            });
                            return Promise.all(actionPromises).then(() => {
                                return rollbackMobileStatus(context, updateResult['@odata.editLink'], true).then(result => {
                                    // Hack -- See MobileStatusPopover.js
                                    binding.OperationMobileStatus_Nav.MobileStatus = result.MobileStatus;
                                });
                            });
                        }
                    });
                }, () => {
                    // If upload fails due to a network issue, roll back Overall Status and Transfer
                    let promises = [];
                    promises.push(rollbackMobileStatus(context, updateResult['@odata.editLink']), true);
                    promises.push(rollbackAssignment(context, selfAssign['@odata.editLink']), true);

                    return Promise.all(promises).then(rollbackResults => {
                        // Hack -- See MobileStatusPopover.js
                        binding.OperationMobileStatus_Nav.MobileStatus = rollbackResults[0].MobileStatus;
                    });
                });
            } else {
                // "Transfer" operation so client doesn't think it's unassigned
                return context.executeAction({'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationUpdateAssignment.action',
                    'Properties': {
                        'Properties': {
                            'PersonNum' : employee,
                        },
                        'Headers': {
                            'Transaction.Ignore': 'true',
                        },
                    },
                });
            }
        });
    } else {
        return Promise.resolve();
    }
}

/**
* Mobile Status post-update rule
* @param {IClientAPI} context
*/
export default function OperationMobileStatusPostUpdate(context) {
    const cicoEnabled = libClock.isCICOEnabled(context);
    const STARTED = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
    const HOLD = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/HoldParameterName.global').getValue());
    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const REVIEW = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/ReviewParameterName.global').getValue());
    const userGUID = common.getUserGuid(context);
    const userId = common.getSapUserName(context);
    
    return IsConfirmationEnabledOperation(context).then((isConfirmationEnabledOperationResult) => {
        const isConfirmationEnabled = isConfirmationEnabledOperationResult;

        const updateResult = (() => {
            try {
                let data = JSON.parse(context.getActionResult('MobileStatusUpdate').data);
                if (data.MobileStatus === 'D-COMPLETE') {
                    data.MobileStatus = COMPLETE;
                }
                if (data.MobileStatus === 'D-REVIEW') {
                    data.MobileStatus = REVIEW;
                }
                return data;
            } catch (exc) {
                // If no action result, assume no mobile status change (CICO) -- return existing PM Mobile Status
                return context.binding.OperationMobileStatus_Nav;
            }
        })();

        let UpdateCICO = function() {
            let requiresCICO = true;
            // Save timestamp for confirmation/CATS
            let odataDate = new ODataDate();
            common.setStateVariable(context, 'StatusStartDate', odataDate.date());

            // Create relevant CICO entry
            let cicoValue = '';
            switch (updateResult.MobileStatus) {
                case STARTED:
                    cicoValue = cicoEnabled ? 'CLOCK_IN' : 'START_TIME';
                    break;
                case HOLD:
                case COMPLETE:
                case REVIEW:
                    cicoValue = cicoEnabled ? 'CLOCK_OUT' : 'END_TIME';
                    break;
                default:
                    break;
            }
            if (updateResult.MobileStatus === COMPLETE) {
                requiresCICO = libClock.isBusinessObjectClockedIn(context);  //Only clock out if this object is clocked in.  Handles supervisor approving a technician's work case
            }

            if (cicoValue && requiresCICO) { //Only add to CICO if status requires
                return context.executeAction({
                    'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                        'Properties': {
                            'RecordId': generateGUID(),
                            'UserGUID': userGUID,
                            'OperationNo': context.binding.OperationNo||context.binding.Operations[0].OperationNo,
                            'SubOperationNo': '',
                            'OrderId': context.binding.OrderId,
                            'PreferenceGroup': cicoValue,
                            'PreferenceName': context.binding.OrderId,
                            'PreferenceValue': odataDate.toDBDateTimeString(context),
                            'UserId': userId,
                        },
                        'CreateLinks': [{
                            'Property': 'WOOperation_Nav',
                            'Target':
                            {
                                'EntitySet': 'MyWorkOrderOperations',
                                'ReadLink': `MyWorkOrderOperations(OrderId='${context.binding.OrderId}',OperationNo='${context.binding.OperationNo||context.binding.Operations[0].OperationNo}')`,
                            },
                        }],
                    },
                }).then(() => {
                    if (updateResult.MobileStatus === 'HOLD') {
                        ZCISHoldStatusEnabled(context);
                    }
                    if ((updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') && isConfirmationEnabled) {
                        return OperationMobileStatusLibrary.showTimeCaptureMessage(context);
                    } else {
                        return Promise.resolve();
                    }
                });
            } else {
                if ((updateResult.MobileStatus === 'HOLD' || updateResult.MobileStatus === 'COMPLETE') && isConfirmationEnabled) {
                    return OperationMobileStatusLibrary.showTimeCaptureMessage(context);
                } else {
                    return Promise.resolve();
                }
            }
        };

        if (updateResult.MobileStatus === COMPLETE || updateResult.MobileStatus === REVIEW) {
            return ChecklistLibrary.allowWorkOrderComplete(context, context.binding.HeaderEquipment, context.binding.HeaderFunctionLocation).then(results => { //Check for non-complete checklists and ask for confirmation
                if (results === true) {
                    return OperationMobileStatusLibrary.completeOperation(context, updateResult, () => { // May throw rejected Promise if signature required and declined
                        return libMobile.NotificationUpdateMalfunctionEnd(context, context.binding);
                    }).catch(() => {
                        // Roll back mobile status update
                        return Promise.reject();
                    });
                } else {
                    return Promise.resolve();
                }
            }).then(() => {
                return supervisor.checkReviewRequired(context, context.binding).then(reviewRequired => {
                    context.binding.SupervisorDisallowFinal = '';
                    if (reviewRequired) {
                        context.binding.SupervisorDisallowFinal = true; //Tech cannot set final confirmation on review
                    }
                    return noteWrapper(context, reviewRequired).then(() => { //Allow tech to leave note for supervisor
                        context.getClientData().ChangeStatus = updateResult.MobileStatus;
                        if (isConfirmationEnabled) {
                            return OperationMobileStatusLibrary.showTimeCaptureMessage(context, !reviewRequired, updateResult.MobileStatus);
                        } else {
                            return Promise.resolve();
                        }
                    });
                });
            }).then(() => {
                let executeExpense = false;
                let executeMilage = false;
                let executePDF = false;
                if (ExpensesVisible(context)) {
                    executeExpense = true;
                }
                if (MileageIsEnabled(context)) {
                    executeMilage = true;
                }
                if (pdfAllowedForOperation(context)) {
                    executePDF = true;
                }
                common.setStateVariable(context, 'IsExecuteExpense', executeExpense);
                common.setStateVariable(context, 'IsExecuteMilage', executeMilage);
                common.setStateVariable(context, 'IsPDFGenerate', executePDF);
                if (executeExpense) {
                    return expenseCreateNav(context);
                } else if (executeMilage) {
                    return mileageAddNav(context);
                } else {
                    return Promise.resolve();
                }
            }).then(() => {
                context.showActivityIndicator('');
                libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
                return UpdateCICO().then(() => {
                    let actionArgs = {
                        OperationId: context.binding.OperationNo,
                        WorkOrderId: context.binding.OrderId,
                        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
                        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
                        didCreateFinalConfirmation: common.getStateVariable(context, 'IsFinalConfirmation', common.getPageName(context)),
                    };
                    let action = new CompleteOperationMobileStatusAction(actionArgs);
                    context.getClientData().confirmationArgs = {
                        doCheckOperationComplete: false,
                    };
                    context.getClientData().mobileStatusAction = action;
                    return action.execute(context).then((result) => {
                        if (result) {
                            LocationUpdate(context);
                            return libClock.reloadUserTimeEntries(context).then(() => {
                                return ToolbarRefresh(context).then(() => {

                                    let PDFGenerationPromise = Promise.resolve();
                                    if (updateResult.MobileStatus === COMPLETE) {
                                        if (!(common.getStateVariable(context, 'IsPDFGenerate') &&
                                            (common.getStateVariable(context, 'IsExecuteMilage') || common.getStateVariable(context, 'IsExecuteExpense')))) {
                                            PDFGenerationPromise = PDFGenerateDuringCompletion(context);
                                        }
                                    }
                                    return PDFGenerationPromise.then(() => {
                                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action').then(() => {
                                            return libAutoSync.autoSyncOnStatusChange(context);
                                        });
                                    });
                                });
                            });
                        }

                        return Promise.reject();
                    });
                });
            }).catch(() => {
                context.dismissActivityIndicator();
                // Roll back mobile status update
                return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
            }).finally(() => {
                context.dismissActivityIndicator();
            });
        } else {
            context.showActivityIndicator('');
            let selfAssignPromise = Promise.resolve();

            if (phaseModelEnabled(context)) {
                selfAssignPromise = PhaseLibrary.isPhaseModelActiveInDataObject(context, context.binding).then(result => {
                    if (result) {
                        return assignToSelf(context, context.binding, updateResult);
                    }

                    return Promise.resolve();
                });
            }

            return selfAssignPromise.then(() => {
                LocationUpdate(context);
                libMobile.phaseModelStatusChange(context, updateResult.MobileStatus);
                return UpdateCICO().then(() => {
                    const properites = {
                        'ObjectKey': updateResult.ObjectKey,
                        'ObjectType': common.getAppParam(context, 'OBJECTTYPE', 'Operation'),
                        'MobileStatus': updateResult.MobileStatus,
                        'EffectiveTimestamp': updateResult.EffectiveTimestamp,
                        'CreateUserGUID': updateResult.CreateUserGUID,
                        'CreateUserId': updateResult.CreateUserId,
                    };
                    return mobileStatusHistoryEntryCreate(context, properites, updateResult['@odata.readLink'])
                    // .then( async ()=>{
                    //     return await ZUpdateWorkOrderStatusForOperationStatusChange(context, updateResult);
                    // })
                    .then(() => {
                        let OrderISULinks;
                        if(context.binding['@odata.type'] ==="#sap_mobile.MyWorkOrderHeader"){
                            OrderISULinks = context.binding.OrderISULinks
                        }
                        else{
                            OrderISULinks = context.binding.WOHeader.OrderISULinks;
                        }
                        
                        if (updateResult.MobileStatus === STARTED && userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Meter.global').getValue()) && OrderISULinks && OrderISULinks.length > 0) {
                            let isuProcess = context.binding.WOHeader.OrderISULinks[0].ISUProcess;
                            if (isuProcess === 'DISCONNECT' || isuProcess === 'RECONNECT') {
                                return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding.WOHeader.DisconnectActivity_Nav[0]['@odata.readLink'], [], '$expand=DisconnectActivityType_Nav,DisconnectActivityStatus_Nav,WOHeader_Nav/OrderMobileStatus_Nav,WOHeader_Nav/OrderISULinks').then((result) => {
                                    if (result && result.getItem(0)) {
                                        let actionBinding = result.getItem(0);
                                        actionBinding.MyWorkOrderOperation = context.binding;
                                        context.setActionBinding(actionBinding);
                                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Meter/Activity/ActivityUpdateNav.action').then((navResult) => {
                                            return navResult;
                                        });
                                    }

                                    return Promise.resolve();
                                });
                            }
                        }

                        return Promise.resolve();
                    }).then(() => {
                        return libClock.reloadUserTimeEntries(context).then(() => {
                            return ToolbarRefresh(context).then(() => {
                                return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action').then(() => {
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            });
                        });
                    });
                });
            }).finally(() => {
                context.dismissActivityIndicator();
            });
        }
    });
}

// async function ZUpdateWorkOrderStatusForOperationStatusChange(context, currentStatusObject = {}) {
//     try {
//         // decide the order or operation binding here
//         let binding = context.binding;
//         let readLink;
//         switch (binding['@odata.type']) {
//             case "#sap_mobile.MyWorkOrderHeader":
//                 readLink = binding['@odata.readLink'];
//                 break
//             case "#sap_mobile.MyWorkOrderOperation":
//                 readLink = binding.WOHeader['@odata.readLink'];
//                 break;
//             default:
//                 break;
//         }

//         let statusObject = await context.read("/SAPAssetManager/Services/AssetManager.service", readLink + '/OrderMobileStatus_Nav', [], '');
//         const constMobileStatuses = {
//             start: 'STARTED',
//             enroute: 'ENROUTE',
//             hold: 'HOLD',
//             complete: 'COMPLETED'
//         };

//         if (statusObject._array && statusObject._array.length) {
//             let OrderMobileStatus_Nav = statusObject._array[0];
//             // decide is it a complete or a other status
//             let statusToBeUpdated = currentStatusObject.MobileStatus ? currentStatusObject.MobileStatus : constMobileStatuses.complete;
//             // read the status from the EAMOverallStatusConfigs entity
//             let statusData = await context.read("/SAPAssetManager/Services/AssetManager.service", 'EAMOverallStatusConfigs', [], `$filter=ObjectType eq 'WORKORDER' and MobileStatus eq '${statusToBeUpdated}'`);
//             let status = statusData._array[0];

//             let commonPropObj = {
//                 EffectiveTimestamp: CurrentDateTime(context),
//                 CreateUserGUID: common.getUserGuid(context),
//                 CreateUserId: common.getSapUserName(context)
//             };

//             // PMMobileStatuses update
//             let PMMobileStatusesObj = {
//                 'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusUpdate.action',
//                 'Properties': {
//                     'Properties': {
//                         'MobileStatus': status.MobileStatus,
//                         'EAMOverallStatusProfile': status.EAMOverallStatusProfile,
//                         'EAMOverallStatus': status.EAMOverallStatus,
//                         'Status': status.Status,
//                         'EffectiveTimestamp': commonPropObj.EffectiveTimestamp,
//                         'CreateUserGUID': commonPropObj.CreateUserGUID,
//                         'CreateUserId': commonPropObj.CreateUserId,
//                     },
//                     'Target': {
//                         'EntitySet': 'PMMobileStatuses',
//                         'ReadLink': OrderMobileStatus_Nav['@odata.readLink'],
//                         'Service': '/SAPAssetManager/Services/AssetManager.service',
//                     },
//                     'Headers': {
//                         'OfflineOData.NonMergeable': true,
//                         'Transaction.Ignore': false
//                     },
//                     'RequestOptions': {
//                         'UpdateMode': 'Replace',
//                     },
//                     'UpdateLinks': [{
//                         'Property': 'OverallStatusCfg_Nav',
//                         'Target':
//                         {
//                             'EntitySet': 'EAMOverallStatusConfigs',
//                             'ReadLink': `EAMOverallStatusConfigs(Status='${status.Status}',EAMOverallStatusProfile='${status.EAMOverallStatusProfile}')`,
//                         },
//                     }],
//                     'OnSuccess': '', // No histories required
//                     'ActionResult': {
//                         '_Name': 'MobileStatusUpdate',
//                     },
//                     'ShowActivityIndicator': false,
//                 },
//             };

//             let PMMobileStatusHistoriesObj = {
//                 'Name': '/SAPAssetManager/Actions/MobileStatus/MobileStatusHistoryUpdate.action',
//                 'Properties': {
//                     'Properties': {
//                         'MobileStatus': status.MobileStatus,
//                         'Status': status.Status,
//                         'EffectiveTimestamp': commonPropObj.EffectiveTimestamp,
//                         'CreateUserGUID': commonPropObj.CreateUserGUID,
//                         'CreateUserId': commonPropObj.CreateUserId,
//                     },
//                     'Target': {
//                         'EntitySet': 'PMMobileStatusHistories',
//                         'Service': '/SAPAssetManager/Services/AssetManager.service',
//                     },
//                     'CreateLinks': [{
//                         'Property': 'PMMobileStatus_Nav',
//                         'Target': {
//                             'EntitySet': 'PMMobileStatuses',
//                             'ReadLink': OrderMobileStatus_Nav['@odata.readLink'],
//                         },
//                     }],
//                 },
//             };

//             return Promise.allSettled([PMMobileStatusesObj, PMMobileStatusHistoriesObj].map(el => context.executeAction(el))).then(res => {
//                 return Promise.resolve();
//             })
//         }
//     } catch (error) {
//         return Promise.resolve();
//     }
// }
