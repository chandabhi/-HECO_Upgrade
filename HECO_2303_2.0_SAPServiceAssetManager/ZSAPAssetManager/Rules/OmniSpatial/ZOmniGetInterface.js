import ZOmniSetupListeners from "./ZOmniSetupListeners";

export default function ZOmniGetInterface(context) {
    var targetCtrl = context.evaluateTargetPath("#Page:OverviewPage/#Control:OmniSpatialRendererControl");
    var webViewExt = targetCtrl.webViewExt;

    //WebView could have been unloaded while minimized or due to app manually being killed
    if (!webViewExt || !webViewExt.src) {
        //Get system ID to determine which Omni URL will be used
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserSystemInfos', [], `$filter=SystemSettingName eq 'SAP_SYSTEM_ID'`).then(readResult => {
            let globalName = '/SAPAssetManager/Globals/OmniSpatial/Omni'+ readResult.getItem(0).SystemSettingValue + '.global';
            // targetCtrl.createView(context.getGlobalDefinition('/SAPAssetManager/Globals/OmniSpatial/OmniURL.global').getValue())
            targetCtrl.createView(context.getGlobalDefinition(globalName).getValue())
                .then((finished) =>//Lublock gas data
                {

                    //Webview ready, setup map event listeners
                    ZOmniSetupListeners(context, webViewExt);
                });

            return new Promise(function (resolve, reject) {
                resolve(webViewExt); //promise resolve

            });
        });
    } else //webView and listeners already setup
    {
        return webViewExt;
    }
}