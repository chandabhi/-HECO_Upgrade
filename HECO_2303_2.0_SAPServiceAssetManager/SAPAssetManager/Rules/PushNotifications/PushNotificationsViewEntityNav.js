import {WorkOrderLibrary as libWo} from '../WorkOrders/WorkOrderLibrary';
import libCom from '../Common/Library/CommonLibrary';
import notificationNavQuery from '../Notifications/NotificationsListViewQueryOption';
import WorkOrderChangeStatusOptions from '../WorkOrders/MobileStatus/WorkOrderChangeStatusOptions';
import pageToolbar from '../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import NotificationChangeStatusOptions from '../Notifications/MobileStatus/NotificationChangeStatusOptions';

export default function PushNotificationsViewEntityNav(context) {
    var binding = libCom.getClientDataForPage(context);
    let entity = '';
    let queryOptions = '';
    let navigateRule = '';
    let mobileStatusOptionsFunc = '';
    let pageName = '';
    if (binding.ObjectType === 'WorkOrder') {
        entity =  'MyWorkOrderHeaders('+ '\'' + binding.TitleLocArgs +'\''+')';
        queryOptions = libWo.getWorkOrderDetailsNavQueryOption(context);
        navigateRule = '/SAPAssetManager/Rules/WorkOrders/WorkOrderDetailsNav.js';
        mobileStatusOptionsFunc = WorkOrderChangeStatusOptions;
        pageName = 'WorkOrderDetailsPage';
    } else if (binding.ObjectType === 'Notification') {
        entity =  'MyNotificationHeaders('+ '\'' + binding.TitleLocArgs +'\''+')';
        queryOptions =  notificationNavQuery(context);
        navigateRule = '/SAPAssetManager/Rules/Notifications/Details/NotificationDetailsNav.js';
        mobileStatusOptionsFunc = NotificationChangeStatusOptions;
        pageName = 'NotificationDetailsPage';
    } 
    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryOptions).then((result) => {
        if (result && result.getItem(0)) {
            context.setActionBinding(result.getItem(0));
            return generateToolbarStatusOptions(context, mobileStatusOptionsFunc, pageName).then(() => {
                return context.executeAction(navigateRule);
            });
        }
        return '';
    });
      
       
}

function generateToolbarStatusOptions(context, getStatusOptionsFunc, pageName) {
    let bindingOriginal = context.binding;
    context._context.binding = context.getActionBinding(); // replace binding with action binding so that we can use WorkOrderChangeStatusOptions before we navigated to the page
    return getStatusOptionsFunc(context).then(items => {
        context._context.binding = bindingOriginal; // revert to original binding 
        return pageToolbar.getInstance().generatePossibleToolbarItems(context, items, pageName).then(() => {
            return Promise.resolve();
        });
    });
}
