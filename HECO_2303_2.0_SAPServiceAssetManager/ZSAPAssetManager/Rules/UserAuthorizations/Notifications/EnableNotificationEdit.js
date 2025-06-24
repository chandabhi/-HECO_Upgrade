/**
* Show/Hide Notification edit button based on User Authorization
* @param {IClientAPI} context
*/
import libCom from '../../Common/Library/CommonLibrary';
import IsWCMOperator from '../../WCM/IsWCMOperator';

export default function EnableNotificationEdit(context, customBinding) {
    const myNotificationHeader = customBinding || context.binding;
    if (IsWCMOperator(context)) {
        return libCom.isCurrentReadLinkLocal(myNotificationHeader['@odata.readLink']);
    }
    return (libCom.getAppParam(context, 'USER_AUTHORIZATIONS', 'Enable.NO.Edit') === 'Y' || libCom.isCurrentReadLinkLocal(myNotificationHeader['@odata.readLink']));
}
