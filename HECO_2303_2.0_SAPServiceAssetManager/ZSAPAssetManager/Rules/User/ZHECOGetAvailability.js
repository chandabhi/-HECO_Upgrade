import CommonLibrary from "../Common/Library/CommonLibrary";

export default function ZHECOGetAvailability(context) {

    let availability = CommonLibrary.getStateVariable(context, 'ZAvailability');

    if (!availability) {
        let query = '$filter=PreferenceGroup eq \'HECO\' and PreferenceName eq \'Available\'';
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPreferences', [], query).then(function (results) {
            let value = 'INAC';
            if (results && results.length) {
                let userPref = results.getItem(0);
                value = userPref.PreferenceValue;
            }

            return value;

        });
    } else {
        return availability;
    }

}
