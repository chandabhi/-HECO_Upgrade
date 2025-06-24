import libNotifMobile from './NotificationMobileStatusLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import Logger from '../../Log/Logger';
import CommonLibrary from '../../Common/Library/CommonLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import HideActionItems from '../../Common/HideActionItems';
import LocationUpdate from '../../MobileStatus/LocationUpdate';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import CanNotificationMobileStatusComplete from './CanNotificationMobileStatusComplete';

export default function NotificationMobileStatusComplete(context) {
	//Get statusElement that was set in NotificationChangeStatusOptions.js. It will be used later on to pass into MobileStatusUpdateOverride.js which updates the mobile status in db.
	let statusElement = CommonLibrary.getStateVariable(context, 'StatusElement');
	const COMPLETED = CommonLibrary.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
	if (statusElement.MobileStatus === COMPLETED) {

		//Don't allow notification to be completed if all notification tasks and notification item tasks are not complete.
		return CanNotificationMobileStatusComplete(context).then(canComplete => {
			if (canComplete) {
				return libNotifMobile.NotificationUpdateMalfunctionEnd(context).then(() => {
					//libNotifMobile.completeNotification does digital signature and device registration. The function name is misleading.
					return libNotifMobile.completeNotification(context, dummyFunction).then(() => {
						LocationUpdate(context);
						//Update the mobile status to complete in db
						return context.executeAction(MobileStatusUpdateOverride(context, statusElement, 'NotifMobileStatus_Nav', '')).then(() => {
							const notificationDetailsPage = 'NotificationDetailsPage';
							let pageContext = MobileStatusLibrary.getPageContext(context, notificationDetailsPage);
							context.getToolbar().setVisible(false, false);
							HideActionItems(pageContext.getPageProxy(), 2);
							return pageContext.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action').then(() => {
								CommonLibrary.removeStateVariable(context, 'StatusElement');
								AutoSyncLibrary.autoSyncOnStatusChange(pageContext);
							});
						});
					});
				});
			} else {
				return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action');
			}
		}).catch((error) => {
			Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
			return context.executeAction('/SAPAssetManager/Actions/Notifications/NotificationMobileStatusFailureMessage.action');
		});
	}

	//The NotificationMobileStatusLibrary.completeNotification function requires a function to be passed in that it calls once it's done.
	//We don't want its default function executeCompletionStepsAfterDigitalSignature() to be called in this case.
	//NotificationMobileStatusLibrary.completeNotification just does digital signature. It should be called doDigitalSignature(context) instead.
	//I don't want to mess with existing code, so I just created a simple dummy function here to pass in that does nothing.
	function dummyFunction() {
		return Promise.resolve();
	}
}
