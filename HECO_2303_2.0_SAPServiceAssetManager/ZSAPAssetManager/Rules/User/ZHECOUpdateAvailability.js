import CommonLibrary from "../Common/Library/CommonLibrary";

export default function ZHECOUpdateAvailability(context) {

    let query = '$filter=PreferenceGroup eq \'HECO\' and PreferenceName eq \'Available\'';
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], query).then(function(results) {
        let availability = 'ACT';
        if (results && results.length) {
            let userPref = results.getItem(0);
            if(userPref.PreferenceValue == 'ACT') {
                availability = 'INAC';
            } else {
                availability = 'ACT';
            }
            CommonLibrary.setStateVariable(context, 'ZAvailability', availability);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/HECO/ZAvailableStatusUpdate.action',
                'Properties': {
                    'UserGuid': userPref.UserGuid,
                    'RecordId': userPref.RecordId,
                    'PreferenceGroup': 'HECO',
                    'PreferenceName': 'Available',
                    'PreferenceValue': availability,
                }
            }).then(() => {
                context.redraw();
            });
        } else { //Preference doesn't exist so create new entry as Inactive
            CommonLibrary.setStateVariable(context, 'ZAvailability', availability);
            return context.executeAction({
                'Name': '/SAPAssetManager/Actions/HECO/ZAvailableStatusCreate.action',
                'Properties': {
                    'UserGuid': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesUserGuidOnCreate.js',
                    'RecordId': '/SAPAssetManager/Rules/UserPreferences/UserPreferencesRecordIdOnCreate.js',
                    'PreferenceGroup': 'HECO',
                    'PreferenceName': 'Available',
                    'PreferenceValue': availability,
                },
            }).then(() => {
                context.redraw();
            });
        }
        
    });
}
