/**
* Updates App Information for cloud reporting metrics.
* Checks if App Info has changed or does not exist.
* Updates App Info if nonexistent or changed, then
* Does a fake entity update on UserGeneralInfos
* so a record is generated with updated app info in
* the header.
* @param {IClientAPI} context
*/
export default async function UpdateAppInformation(context) {

    const appName = context.getAppClientData().MobileServiceAppId;
    const appVersion = context.getVersionInfo()['Application Version'];
    const backendVersion = await context.read('/SAPAssetManager/Services/AssetManager.service', 'UserGeneralInfos', [], '').then(items => {
        if (items && items.length > 0) {
            return items.getItem(0).MobileApp;
        }
        return '';
    }).catch(() => '');
    const mdkVersion = context.getVersionInfo()['MDKClient Version'];
    const platform = (function() {
        if (context.nativescript.platformModule.isIOS) {
            return 'ios';
        } else if (context.nativescript.platformModule.isAndroid) {
            return 'android';
        } else {
            return 'unknown';
        }
    })();
    return `name=${appName};version=${appVersion};backend-version=${backendVersion};mdk-version=${mdkVersion};platform=${platform}`;
}
