
export default function ZNotificationActivityCreateUpdateLocationNote(context) {
    let pageProxy = context.getPageProxy();
    let binding = pageProxy.binding;

    let codeGroup = pageProxy.evaluateTargetPathForAPI('#Control:GroupLstPkr').getValue();
    let code = context.getValue()[0].ReturnValue; //Returns the value for the object that triggered this function

    let notifLookup = Promise.resolve(binding.NotificationType);

    if (binding['@odata.type'] !== '#sap_mobile.MyNotificationHeader') {
        if (binding['@odata.type'] === '#sap_mobile.MyNotificationItem' || binding['@odata.type'] === '#sap_mobile.MyNotificationActivity') {
            binding = binding.Notification;
            notifLookup = Promise.resolve(binding.NotificationType);
        } else if (binding['@odata.type'] === '#sap_mobile.MyNotificationItemActivity') {
            binding = binding.Item.Notification;
            notifLookup = Promise.resolve(binding.NotificationType);
        } else {
            binding = common.getStateVariable(context, 'CreateNotification');
            notifLookup = Promise.resolve(binding.NotificationType);
        }
    }
    return notifLookup.then(type => {
        return context.read('/SAPAssetManager/Services/AssetManager.service', `ZNotifActivityTextCodifications`, [], `$filter=ZNotifType eq '${type}' and ZNotifActivityGroup eq '${codeGroup[0].ReturnValue}' and ZNotifActivityCode eq '${code}'`).then(codeType => {
            if(codeType && codeType.length) {
                let codification = codeType.getItem(0).ZTextCodification;
                if(codification == 'MR_NOTE') {
                    pageProxy.evaluateTargetPathForAPI('#Control:DescriptionTitle').setVisible(false);
                    pageProxy.evaluateTargetPathForAPI('#Control:ZLocationLstPkr').setVisible(false);
                    return pageProxy.evaluateTargetPathForAPI('#Control:ZMeterReaderLstPkr').setVisible(true);
                }else if(codification == 'PLNT_LOC') {
                    pageProxy.evaluateTargetPathForAPI('#Control:DescriptionTitle').setVisible(false);
                    pageProxy.evaluateTargetPathForAPI('#Control:ZLocationLstPkr').setVisible(true);
                    return pageProxy.evaluateTargetPathForAPI('#Control:ZMeterReaderLstPkr').setVisible(false);
                }
            }
            //No predefined codes, let them enter activity text as normal
            pageProxy.evaluateTargetPathForAPI('#Control:DescriptionTitle').setVisible(true);
            pageProxy.evaluateTargetPathForAPI('#Control:ZLocationLstPkr').setVisible(false);
            return pageProxy.evaluateTargetPathForAPI('#Control:ZMeterReaderLstPkr').setVisible(false);
        });
    });


}
