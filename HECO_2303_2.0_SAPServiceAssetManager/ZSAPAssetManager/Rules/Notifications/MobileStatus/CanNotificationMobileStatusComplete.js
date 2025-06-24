import libNotifMobile from './NotificationMobileStatusLibrary';

export default function CanNotificationMobileStatusComplete(context) {
	return Promise.all([
		libNotifMobile.isAllTasksComplete(context),  // Check if all notification tasks are completed.
		libNotifMobile.isAllItemTasksComplete(context), // Check if all notification item tasks are completed.
	]).then(([isAllTaskCompleted, isAllItemTaskCompleted]) => !!isAllTaskCompleted && !!isAllItemTaskCompleted);
}
