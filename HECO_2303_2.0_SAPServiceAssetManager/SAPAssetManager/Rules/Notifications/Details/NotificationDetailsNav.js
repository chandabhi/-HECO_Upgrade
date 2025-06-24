import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCommon from '../../Common/Library/CommonLibrary';
import NotificationChangeStatusOptions from '../MobileStatus/NotificationChangeStatusOptions';
import NotificationDetailsNavQueryOptions from './NotificationDetailsNavQueryOptions';
import Logger from '../../Log/Logger';

export default function NotificationDetailsNav(context) {
    const navAction = '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action';
    let pageProxy = context.getPageProxy();
    let bindingOriginal = pageProxy.binding;
    let actionBinding = pageProxy.getActionBinding();
    let isFollowOn = false;

    if (actionBinding['@odata.type'] === '#sap_mobile.NotificationHistory') {
        actionBinding = actionBinding.NotificationHeader_Nav;
        isFollowOn = true;
    }

    pageProxy._context.binding = actionBinding; // replace binding with action binding so that we can use OperationChangeStatusOptions before we navigated to the page
    return NotificationChangeStatusOptions(pageProxy).then(items => {
        pageProxy._context.binding = bindingOriginal; // revert to original binding 
        return pageToolbar.getInstance().generatePossibleToolbarItems(pageProxy, items, 'NotificationDetailsPage').then(() => {
            if (isFollowOn) {
                return navigateToDetailsOnRead(context, navAction, actionBinding.NotificationNumber);
            }
            return context.executeAction(navAction);
        });
    }).catch(error => {
        pageProxy._context.binding = bindingOriginal;
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
        return pageProxy.executeAction(navAction);
    });
}

function navigateToDetailsOnRead(context, navAction, notifID) {
    const query = NotificationDetailsNavQueryOptions(context);
    return libCommon.navigateOnRead(context, navAction, `MyNotificationHeaders('${notifID}')`, query);
}
