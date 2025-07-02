import WorkOrderMobileStatusLibrary from '../../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/WorkOrderMobileStatusLibrary';
import CompleteWorkOrderMobileStatusAction from '../../../../SAPAssetManager/Rules/WorkOrders/MobileStatus/CompleteWorkOrderMobileStatusAction';
import RedrawCompletePage from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/RedrawCompletePage';
import PDFGenerateDuringCompletion from '../../../../SAPAssetManager/Rules/PDF/PDFGenerateDuringCompletion';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import libAutoSync from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/AutoSyncLibrary';
import OperationMobileStatusLibrary from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/OperationMobileStatusLibrary';
import libMobile from '../../../../SAPAssetManager/Rules/MobileStatus/MobileStatusLibrary';
import ODataDate from '../../../../SAPAssetManager/Rules/Common/Date/ODataDate';
import libClock from '../../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import generateGUID from '../../../../SAPAssetManager/Rules/Common/guid';
import CompleteOperationMobileStatusAction from '../../../../SAPAssetManager/Rules/Operations/MobileStatus/CompleteOperationMobileStatusAction';
import CompleteSubOperationMobileStatusAction from '../../../../SAPAssetManager/Rules/SubOperations/MobileStatus/CompleteSubOperationMobileStatusAction';
import SubOperationMobileStatusLibrary from '../../../../SAPAssetManager/Rules/SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import IsTimeStepVisible from '../../../../SAPAssetManager/Rules/Operations/IsTimeStepVisible';
import SupervisorLibrary from '../../../../SAPAssetManager/Rules/Supervisor/SupervisorLibrary';
import S4MobileStatusUpdateOverride from '../../../../SAPAssetManager/Rules/ServiceOrders/Status/S4MobileStatusUpdateOverride';
import Logger from '../../../../SAPAssetManager/Rules/Log/Logger';
import TimeSheetsIsEnabled from '../../../../SAPAssetManager/Rules/TimeSheets/TimeSheetsIsEnabled';
import CurrentDateTime from "../../../../SAPAssetManager/Rules/DateTime/CurrentDateTime";

export default function FinalizeCompletePage(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    return Promise.all([IsTimeStepVisible(context), SupervisorLibrary.checkReviewRequired(context, binding)]).then((checks) => {
        let isConfirmationEnabled = checks[0];
        let isReviewRequired = checks[1];

        if (!WorkOrderCompletionLibrary.validateSteps(context)) {
            WorkOrderCompletionLibrary.setValidationMessages(context);
            RedrawCompletePage(context);
            return Promise.reject();
        } else {
            WorkOrderCompletionLibrary.resetValidationMessages(context);
            RedrawCompletePage(context);
        }

        let completeAction = Promise.resolve();
        let mobileStatus = '';

        if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {
            let actions = beforeOperationComplete(context, isConfirmationEnabled, isReviewRequired);
            completeAction = getOperationCompleteAction(context);
            mobileStatus = getOperationMobileStatus(context);
            let pageContext = context;
            return Promise.all(actions).then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                    .then(() => {
                        return OperationMobileStatusLibrary.isAnyOperationStarted(context).then(() => {
                            return OperationMobileStatusLibrary.didSetOperationComplete(pageContext, mobileStatus).then(() => {
                                return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                                    let pdfAction = isReviewRequired ? Promise.resolve() : PDFGenerateDuringCompletion(context, binding);
                                    return pdfAction.then(() => {
                                        WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                                        WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                        WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                                        return completeAction.executeCheckWorkOrderCompleted(pageContext, completeAction).then(async () => {
                                            //HECO Copy completion notes to Order Header for TC01 orders
                                            // if(context.binding.OrderType&&context.binding.OrderType === 'TC01'){
                                            //     if(context.binding.Operations[0]&&context.binding.Operations[0].OperationMobileStatus_Nav){
                                            //         await ZUpdateWorkOrderStatusForOperationStatusChange(pageContext,context.binding.Operations[0].OperationMobileStatus_Nav);
                                            //     }
                                            // }
                                            let operCompleteNote = libCom.getStateVariable(context, 'ZOperationCompleteNote');
                                            if (
                                                (context.binding.WOHeader && context.binding.WOHeader.OrderType === 'TC01' 
                                                    && operCompleteNote 
                                                    && operCompleteNote.longTextNote !== '"OP_COMPLETE: "') 
                                                || 
                                                (operCompleteNote&&context.binding.OrderType === 'TC01')
                                            ){
                                                    
                                                context.executeAction('/ZSAPAssetManager/Actions/Notes/Create/ZNotesCopyOperCompleteToWO.action').then(() => {
                                                    libCom.setStateVariable(context, 'ZOperationCompleteNote', '');
                                                    return libAutoSync.autoSyncOnStatusChange(context);
                                                })
                                            } else {
                                                return libAutoSync.autoSyncOnStatusChange(context);
                                            }
                                            // 
                                        });
                                    });
                                });
                            });
                        });
                    })
                    .catch((error) => {
                        Logger.error('Completion Failed', error);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                    });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
            let actions = beforeSubOperationComplete(context, isConfirmationEnabled);
            completeAction = getSubOperationCompleteAction(context);
            mobileStatus = getSubOperationMobileStatus(context);
            let pageContext = context;
            return Promise.all(actions).then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                    .then(() => {
                        return SubOperationMobileStatusLibrary.isAnySubOperationStarted(context).then(() => {
                            return pageContext.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                                return SubOperationMobileStatusLibrary.didSetSubOperationCompleteWrapper(pageContext, mobileStatus).then(() => {
                                    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                                    libCom.removeBindingObject(context);
                                    libCom.removeStateVariable(context, 'contextMenuSwipePage');

                                    return completeAction.executeCheckOperationCompleted(pageContext, completeAction).then(() => {
                                        return libAutoSync.autoSyncOnStatusChange(context);
                                    });
                                });
                            });
                        });
                    })
                    .catch((error) => {
                        Logger.error('Completion Failed', error);
                        return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                    });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
            mobileStatus = getServiceOrderMobileStatus(context);
            completeAction = getServiceOrderCompleteAction(context, mobileStatus, binding);
            let pageContext = context;
            return pageContext.executeAction(completeAction)
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/ServiceOrderMobileStatusSuccessMessage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        }).finally(() => {
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        } else if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
            mobileStatus = getServiceItemMobileStatus(context);
            completeAction = getServiceItemCompleteAction(context, mobileStatus, binding);
            let pageContext = context;
            return pageContext.executeAction(completeAction)
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemMobileStatusSuccessMessage.action').then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        }).finally(() => {
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        } else {
            completeAction = getWOCompleteAction(context);
            mobileStatus = getWOMobileStatus(context);
            let pageContext = context;
            return completeAction.execute(pageContext)
                .then(() => {
                    return WorkOrderMobileStatusLibrary.didSetWorkOrderComplete(pageContext, mobileStatus).then(() => {
                        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
                            libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
                            return WorkOrderMobileStatusLibrary.isAnyWorkOrderStarted(context).then(() => {
                                let pdfAction = isReviewRequired ? Promise.resolve() : PDFGenerateDuringCompletion(context, binding);
                                return pdfAction.then(() => {
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            });
                        }).finally(() => {
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                });
        }
    });
}

function getWOMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OrderMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'WorkOrder');
    }

    return mobileStatus;
}

function getOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OperationMobileStatus_Nav||binding.Operations[0].OperationMobileStatus_Nav;;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'Operation');
    }

    return mobileStatus;
}

function getSubOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.SubOpMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'SubOperation');
    }

    return mobileStatus;
}

function getWOCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        WorkOrderId: binding.OrderId,
    };
    let action = new CompleteWorkOrderMobileStatusAction(actionArgs);

    context.getClientData().confirmationArgs = {
        doCheckWorkOrderComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function getOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        OperationId: binding.OperationNo||binding.Operations[0].OperationNo,
        WorkOrderId: binding.OrderId,
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckOperationComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function beforeOperationComplete(context, isConfirmationEnabled, isReviewRequired) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    if ((TimeSheetsIsEnabled(context) && !isReviewRequired) || (!WorkOrderCompletionLibrary.getStepValue(context, 'time') && isConfirmationEnabled && !isReviewRequired)) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }

    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
        var odataDate = new ODataDate();
        actions.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': libCom.getUserGuid(context),
                    'OperationNo': binding.OperationNo||binding.Operations[0].OperationNo,
                    'OrderId': binding.OrderId,
                    'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                    'PreferenceName': binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': libCom.getSapUserName(context),
                },
                'CreateLinks': [{
                    'Property': 'WOOperation_Nav',
                    'Target':
                    {
                        'EntitySet': 'MyWorkOrderOperations',
                        'ReadLink': "MyWorkOrderOperations(OrderId='" + binding.OrderId + "',OperationNo='" + (binding.OperationNo != null ? binding.OperationNo : binding.Operations[0].OperationNo) + "')",
                    },
                }],
            },
        }));
    }

    return actions;
}

function beforeSubOperationComplete(context, isConfirmationEnabled) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    if (TimeSheetsIsEnabled(context) || (!WorkOrderCompletionLibrary.getStepValue(context, 'time') && isConfirmationEnabled)) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }

    if (libMobile.isSubOperationStatusChangeable(context)) {
        libClock.setClockOutSubOperationODataValues(context);
        actions.push(context.executeAction(
            {
                'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCom.getUserGuid(context),
                        'OperationNo': binding.OperationNo,
                        'SubOperationNo': binding.SubOperationNo,
                        'OrderId': binding.OrderId,
                        'PreferenceGroup': 'END_TIME',
                        'PreferenceName': binding.OrderId,
                        'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                        'UserId': libCom.getSapUserName(context),
                    },
                    'CreateLinks': [{
                        'Property': 'WOSubOperation_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyWorkOrderSubOperations',
                            'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                        },
                    }],
                },
            },
        ));
    }

    return actions;
}

function getSubOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        SubOperationId: binding.SubOperationNo,
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isSubOperationStatusChangeable: libMobile.isSubOperationStatusChangeable(context),
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteSubOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckSubOperationComplete: false,
        doCheckOperationComplete: false,
    };

    return action;
}

function getServiceOrderMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.MobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'S4_SRV_ORDER');
    }

    return mobileStatus;
}

function getServiceItemMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.MobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'S4_SRV_ITEM');
    }

    return mobileStatus;
}

function getServiceOrderCompleteAction(context, status, binding) {
    const completeMobileStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    status.MobileStatus = completeMobileStatus;
    status.Status = `${status.ObjectType}: ${completeMobileStatus}`;
    return S4MobileStatusUpdateOverride(context, binding, status);
}

function getServiceItemCompleteAction(context, status, binding) {
    const completeMobileStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    status.MobileStatus = completeMobileStatus;
    status.Status = `${status.ObjectType}: ${completeMobileStatus}`;
    return S4MobileStatusUpdateOverride(context, binding, status);
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
//                 CreateUserGUID: libCom.getUserGuid(context),
//                 CreateUserId: libCom.getSapUserName(context)
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
