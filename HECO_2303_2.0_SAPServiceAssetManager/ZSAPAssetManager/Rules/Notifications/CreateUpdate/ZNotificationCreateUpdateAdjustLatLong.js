import locSvcMgr from '../../../../SAPAssetManager/Rules/LocationTracking/Services/ServiceManager';
import NotificationUpdateSuccess from './../../../../SAPAssetManager/Rules/Notifications/CreateUpdate/NotificationUpdateSuccess';

export default function ZNotificationCreateUpdateAdjustLatLong(clientAPI) {
    //HECO
    //Get current lat/long and add to Notification Z attributes
    //Existing backend user exits will use lat/long to update device location

    clientAPI.showActivityIndicator('');
    let binding = clientAPI.binding;
    locSvcMgr.getInstance().getCurrentLocation().then(geoJson => {

        let notificationUpdateProperties = {
            'ZAdjustedObjectLatitude': geoJson.geometry.coordinates[0][0].toFixed(6).toString(),
            'ZAdjustedObjectLongitude': geoJson.geometry.coordinates[0][1].toFixed(6).toString(),
        };

        return clientAPI.executeAction({
            'Name': '/SAPAssetManager/Actions/Notifications/CreateUpdate/NotificationUpdate.action',
            'Properties': {
                'Properties': notificationUpdateProperties,
                'OnSuccess': '',
                'Target':
                {
                    "EntitySet": "MyNotificationHeaders",
                    "Service": "/SAPAssetManager/Services/AssetManager.service",
                    "ReadLink": binding["@odata.readLink"]
                },
                'Headers':
                {
                    'OfflineOData.TransactionID': binding.NotificationNumber
                },
                'UpdateLinks': '',
                'DeleteLinks': '',
            },
        }).then(() => {
            // return NotificationUpdateSuccess(clientAPI);
            clientAPI.dismissActivityIndicator();
        });
    }).catch(() => {
        clientAPI.dismissActivityIndicator();
    });
}
