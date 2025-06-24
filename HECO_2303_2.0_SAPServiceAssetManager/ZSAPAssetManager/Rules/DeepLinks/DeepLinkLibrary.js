import CommonLibrary from '../Common/Library/CommonLibrary';
import EnableMultipleTechnician from '../SideDrawer/EnableMultipleTechnician';
import EnableNotificationCreate from '../UserAuthorizations/Notifications/EnableNotificationCreate';
import IsSupervisorEnableWorkOrderEdit from '../Supervisor/SupervisorRole/IsSupervisorEnableWorkOrderEdit';
import EnableTimeSheetCreate from '../UserAuthorizations/TimeSheets/EnableTimeSheetCreate';
import TimeSheetsIsEnabled from '../TimeSheets/TimeSheetsIsEnabled';
import IsWorkOrderAllowedToCreateUpdate from '../WorkOrders/CreateUpdate/IsWorkOrderAllowedToCreateUpdate';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';
import EnableConfirmationCreate from '../UserAuthorizations/Confirmations/EnableConfirmationCreate';
import ConfirmationsIsEnabled from '../Confirmations/ConfirmationsIsEnabled';
import SubOperationCreateNav from '../SubOperations/CreateUpdate/SubOperationCreateNav';
import PartCreateNav from '../Parts/CreateUpdate/PartCreateNav';
import AssignmentType from '../Common/Library/AssignmentType';
import PartIssueNav from '../Parts/Issue/PartIssueNav';
import SubOperationsListViewNav from '../WorkOrders/SubOperations/SubOperationsListViewNav';
import ManageDeepLink from './ManageDeepLink';
import WorkOrdersListViewNav from '../WorkOrders/WorkOrdersListViewNav';
import WorkOrderCreateNav from '../WorkOrders/CreateUpdate/WorkOrderCreateNav';
import WorkOrderOperationCreateNav from '../WorkOrders/Operations/CreateUpdate/WorkOrderOperationCreateNav';
import OperationsListViewNav from '../WorkOrders/Operations/OperationsListViewNav';
import NotificationCreateChangeSetNav from '../Notifications/CreateUpdate/NotificationCreateChangeSetNav';
import TimeSheetEntryCreateNav from '../TimeSheets/Entry/CreateUpdate/TimeSheetEntryCreateNav';
import ConfirmationCreateUpdateNav from '../Confirmations/CreateUpdate/ConfirmationCreateUpdateNav';
import SubOperationsListViewQueryOption from '../SubOperations/SubOperationsListViewQueryOption';
import IsSubOperationLevelAssigmentType from '../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsOperationLevelAssigmentType from '../WorkOrders/Operations/IsOperationLevelAssigmentType';
import EnableNotificationEdit from '../UserAuthorizations/Notifications/EnableNotificationEdit';
import PartEditEnable from '../Parts/PartEditEnable';
import { WorkOrderLibrary } from '../WorkOrders/WorkOrderLibrary';
import { EquipmentLibrary } from '../Equipment/EquipmentLibrary';
import { OperationConstants } from '../WorkOrders/Operations/WorkOrderOperationLibrary';

export default class DeepLinkLibrary {
    static CreateIssuePartAllowed(context) {
        return EnableMultipleTechnician(context)
            && CommonLibrary.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.Parts.Issue') === 'Y';
    }

    static CreateNotificationAllowed(context) {
        return EnableMultipleTechnician(context) && EnableNotificationCreate(context);
    }

    static CreateOperationAllowed(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId) {
            return EnableMultipleTechnician(context) && IsSupervisorEnableWorkOrderEdit(context);
        }
        return EnableMultipleTechnician(context) && IsSupervisorEnableWorkOrderEdit(context)
            && CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'Operation';
    }

    static CreateTimesheetAllowed(context) {
        return EnableMultipleTechnician(context) && EnableTimeSheetCreate(context)
            && TimeSheetsIsEnabled(context);
    }

    static CreateWorkOrderAllowed(context) {
        return EnableMultipleTechnician(context) && IsWorkOrderAllowedToCreateUpdate(context);
    }

    static CreateSubOperationAllowed(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId && parameters.OperationNo) {
            return EnableMultipleTechnician(context) && EnableWorkOrderEdit(context);
        }

        return EnableMultipleTechnician(context) && EnableWorkOrderEdit(context)
            && CommonLibrary.getWorkOrderAssnTypeLevel(context) === 'SubOperation';
    }

    static CreateConfirmationAllowed(context) {
        return EnableMultipleTechnician(context)
            && EnableConfirmationCreate(context) && ConfirmationsIsEnabled(context);
    }

    static CreateWorkOrderNav(context) {
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        ManageDeepLink.getInstance().setObjectVariables(context);
        return DeepLinkLibrary.ViewWorkOrderNav(context).then(() => {
            return WorkOrderCreateNav(context);
        });
    }

    static CreateOperationNav(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId) {
            let queryOptions = `$filter=OrderId eq '${parameters.OrderId}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', [], queryOptions)
                .then(function(result) {
                    if (result.length) {
                        if (parameters.OperationShortText) {
                            parameters.OrderDescription = parameters.OperationShortText;
                        }
                        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, result.getItem(0));
                        ManageDeepLink.getInstance().setObjectVariables(context);
                        return DeepLinkLibrary.ViewWorkOrderNav(context, true).then(() => {
                            return WorkOrderOperationCreateNav(context);
                        });
                    }
                    return Promise.reject({ 'key': 'deep_link_invalid_action' });
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }

        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        ManageDeepLink.getInstance().setObjectVariables(context);
        return DeepLinkLibrary.ViewOperationNav(context).then(() => {
            return WorkOrderOperationCreateNav(context);
        });
    }

    static CreateSubOperatationNav(context) {
        let parameters = ManageDeepLink.getInstance().getLink().getParameters();
        if (parameters && parameters.OrderId && parameters.OperationNo) {
            let queryOptions = `$filter=OrderId eq '${parameters.OrderId}' and OperationNo eq '${parameters.OperationNo}'`;
            return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderOperations', [], queryOptions)
                .then(function(result) {
                    if (result.length) {
                        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, result.getItem(0));
                        return DeepLinkLibrary.ViewOperationNav(context, true).then(() => {
                            return SubOperationCreateNav(context);
                        });
                    }
                    return Promise.reject({ 'key': 'deep_link_invalid_action' });
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        }
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return DeepLinkLibrary.ViewSubOperationNav(context).then(() => {
            return SubOperationCreateNav(context);
        });
    }

    static CreateNotificationNav(context) {
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return DeepLinkLibrary.ViewNotificationNav(context).then(() => {
            return NotificationCreateChangeSetNav(context);
        });
    }

    static CreateTimeSheetNav(context) {
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        ManageDeepLink.getInstance().setObjectVariables(context);
        return context.executeAction('/SAPAssetManager/Actions/TimeSheets/TimeSheetEntriesListViewNav.action').then(() => {
            return TimeSheetEntryCreateNav(context);
        });
    }

    static CreateConfirmationNav(context) {
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, { 'IsOnCreate': true });
        return context.executeAction('/SAPAssetManager/Actions/Confirmations/ConfirmationsOverviewListViewNav.action').then(() => {
            return ConfirmationCreateUpdateNav(context);
        });
    }

    static CreatePartNav(context) {
        CommonLibrary.setOnCreateUpdateFlag(context, '');
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, { 'ItemCategory': '' });
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartsListViewNav.action').then(() => {
            CommonLibrary.setOnCreateUpdateFlag(context, 'CREATE');
            return PartCreateNav(context);
        });
    }

    static CreateIssuePartNav(context) {
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context, { 'ItemCategory': '' });
        return context.executeAction('/SAPAssetManager/Actions/Parts/PartsListViewNav.action').then(() => {
            return PartIssueNav(context);
        });
    }

    static SetWorkOrderVariables(context, parameters) {
        if (parameters) {
            if (parameters.PlanningPlant) {
                CommonLibrary.setStateVariable(context, 'WODefaultPlanningPlant', parameters.PlanningPlant);
            }
            if (parameters.MainWorkCenterPlant) {
                CommonLibrary.setStateVariable(context, 'WODefaultWorkCenterPlant', parameters.MainWorkCenterPlant);
            }
            if (parameters.MainWorkCenter) {
                CommonLibrary.setStateVariable(context, 'WODefaultMainWorkCenter', parameters.MainWorkCenter);
            }
        }
    }

    static SetSubOperationVariables(context, parameters) {
        if (context && parameters) {
            let values = {
                'type': 'WorkOrderSubOperation',
            };

            if (parameters.MainWorkCenterPlant) {
                values.WorkCenterPlant = {
                    'default': parameters.MainWorkCenterPlant,
                };
            }
            if (parameters.MainWorkCenter) {
                values.MainWorkCenter = {
                    'default': parameters.MainWorkCenter,
                };
            }

            AssignmentType.setWorkOrderAssignmentDefaults(values);
        }
    }

    static SetOperationVariables(context, parameters) {
        CommonLibrary.removeStateVariable(context, 'WorkOrder');

        if (parameters) {
            let values = {
                'type': 'WorkOrderOperation',
            };

            if (parameters.MainWorkCenterPlant) {
                values.WorkCenterPlant = {
                    'default': parameters.MainWorkCenterPlant,
                };
            }
            if (parameters.MainWorkCenter) {
                values.MainWorkCenter = {
                    'default': parameters.MainWorkCenter,
                };
            }

            AssignmentType.setWorkOrderAssignmentDefaults(values);
        }
    }

    static SetTimesheetVariables(context, parameters) {
        if (context && parameters) {
            if (parameters.OrderId) {
                CommonLibrary.setStateVariable(context, 'OrderId', parameters.OrderId);
            }
            if (parameters.ActivityType) {
                CommonLibrary.setStateVariable(context, 'ActivityType', parameters.ActivityType);
            }
            if (parameters.AttendanceType) {
                CommonLibrary.setStateVariable(context, 'AttendanceType', parameters.AttendanceType);
            }
        }
    }

    static ViewWorkOrderNav(context, isDetailsView) {
        if (isDetailsView) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action');
        }
        return WorkOrdersListViewNav(context);
    }

    static SetWorkOrderQueryOptions(context) {
        return WorkOrderLibrary.getWorkOrderDetailsNavQueryOption(context);
    }

    static ViewOperationNav(context, isDetailsView) {
        if (isDetailsView) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action');
        }

        if (DeepLinkLibrary.ViewOperationAllowed(context)) {
            ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
            return OperationsListViewNav(context);
        }

        return Promise.reject({'key': 'deep_link_invalid_action'});
    }

    static SetOperationQueryOptions(context) {
        return OperationConstants.FromWOrkOrderOperationListQueryOptions(context, false);
    }

    static ViewSubOperationNav(context, isDetailsView) {
        if (isDetailsView) {
            return context.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationDetailsNav.action');
        }

        if (DeepLinkLibrary.ViewSubOperationAllowed(context)) {
            ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
            return SubOperationsListViewNav(context);
        }
      
        return Promise.reject({'key': 'deep_link_invalid_action'});
    }

    static SetSubOperationsQueryOptions(context) {
        return SubOperationsListViewQueryOption(context);
    }

    static ViewNotificationNav(context, isDetailsView) {
        if (isDetailsView) {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action');
        }
        CommonLibrary.setStateVariable(context, 'OnFollowOnNotificationsList', false);
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationsListViewNav.action');
    }

    static ViewFunctionalLocationNav(context, isDetailsView) {
        if (isDetailsView) {
            return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationDetailsNav.action');
        }
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return context.executeAction('/SAPAssetManager/Actions/FunctionalLocation/FunctionalLocationsListViewNav.action');
    }

    static ViewEquipmentNav(context, isDetailsView) {
        if (isDetailsView) {
            return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentDetailsNav.action');
        }
        ManageDeepLink.getInstance().replaceAndSetActionBindingWithParameters(context);
        return context.executeAction('/SAPAssetManager/Actions/Equipment/EquipmentListViewNav.action');

    }

    static SetEquipmentQueryOptions() {
        return EquipmentLibrary.equipmentDetailsQueryOptions();
    }

    static ViewActionAllowed(context) {
        return EnableMultipleTechnician(context);
    }

    static ViewSubOperationAllowed(context) {
        return IsSubOperationLevelAssigmentType(context);
    }

    static ViewOperationAllowed(context) {
        return IsOperationLevelAssigmentType(context);
    }

    static UpdateWorkOrderNav(context) {
        WorkOrderLibrary.removeFollowUpFlagPage(context);
        CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
        ManageDeepLink.getInstance().setObjectVariables(context);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WorkOrders/WorkOrderDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Actions/WorkOrders/CreateUpdate/WorkOrderCreateUpdateNav.action',
            },
        });
    }

    static UpdateWorkOrderAllowed(context, binding) {
        return EnableWorkOrderEdit(context, binding);
    }

    static UpdateOperationNav(context) {
        CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
        ManageDeepLink.getInstance().setObjectVariables(context);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Actions/WorkOrders/Operations/WorkOrderOperationCreateUpdateNav.action',
            },
        });
    }

    static UpdateSubOperationNav(context) {
        CommonLibrary.setOnCreateUpdateFlag(context, 'UPDATE');
        ManageDeepLink.getInstance().setObjectVariables(context);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationCreateUpdateNav.action',
            },
        });
    }

    static UpdateNotificationNav(context) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/Notifications/NotificationUpdateNav.js',
            },
        });
    }

    static UpdateNotificationAllowed(context, binding) {
        return EnableNotificationEdit(context, binding);
    }

    static UpdateCatsTimesheetNav(context) {
        ManageDeepLink.getInstance().setObjectVariables(context);
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/TimeSheets/TimeEntryViewNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/TimeSheets/TimeSheetEntryEditNav.js',
            },
        });
    }

    static UpdateConfirmationNav(context) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Confirmations/ConfirmationDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/Confirmations/CreateUpdate/ConfirmationUpdateNav.js',
            },
        });
    }

    static UpdatePartAllowed(context, binding) {
        return PartEditEnable(context, binding);
    }

    static UpdatePartNav(context) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Parts/PartDetailsNav.action',
            'Properties': {
                'OnSuccess': '/SAPAssetManager/Rules/Parts/PartUpdateNav.js',
            },
        });
    }
}
