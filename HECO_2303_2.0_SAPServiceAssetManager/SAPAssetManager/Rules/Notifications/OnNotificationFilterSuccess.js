import notificationSetCaption from './ListView/NotificationListSetCaption';
export default function OnNotificationFilterSuccess(context) {

    let sectionedTableProxy = context.getControls()[0];
    sectionedTableProxy.redraw();    
    return notificationSetCaption(context);   
}
