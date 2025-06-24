import libNotifMobile from './NotificationMobileStatusLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import Logger from '../../Log/Logger';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';

export default function NotificationMobileStatusUpdateOnSuccess(context) {

    let mobileStatusUpdateActionResult = context.getActionResult('MobileStatusUpdate');

    if (mobileStatusUpdateActionResult) {
        let mobileStatusUpdateActionResultObject = JSON.parse(mobileStatusUpdateActionResult.data);

        const notificationDetailsPage = 'NotificationDetailsPage';
        const COMPLETE = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
        let pageContext = MobileStatusLibrary.getPageContext(context, notificationDetailsPage);
        context.showActivityIndicator('');

        if (mobileStatusUpdateActionResultObject.MobileStatus === COMPLETE) {
            //Only allow notification complete if all header and item level tasks are complete
            let tasksPromises = [];
            tasksPromises.push(libNotifMobile.isAllTasksComplete(context));
            tasksPromises.push(libNotifMobile.isAllItemTasksComplete(context));

            return Promise.all(tasksPromises).then(results => {
                if (results[0] && results[1]) {
                    return libNotifMobile.completeNotification(context).then(() => {
                        LocationUpdate(context);
                        return ToolbarRefresh(context).then(() => {
                            HideActionItems(pageContext.getPageProxy(), 2);
                            return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                                return AutoSyncLibrary.autoSyncOnStatusChange(context);
                            });
                        });
                    });
                } else {
                    return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action').then(() => {
                        //Rollback mobile status update on any errors
                        return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
                    });
                }
            }).catch((error) => {
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action').then(() => {
                    //Rollback mobile status update on any errors
                    return context.executeAction('/SAPAssetManager/Rules/MobileStatus/PhaseModelStatusUpdateRollback.js');
                });
            }).finally(() => {
                context.dismissActivityIndicator();
            });
        } else {
            LocationUpdate(context);
            return ToolbarRefresh(context).then(() => {
                return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
                    return AutoSyncLibrary.autoSyncOnStatusChange(context);
                });
            }).finally(() => {
                context.dismissActivityIndicator();
            });
        }
    }

}
