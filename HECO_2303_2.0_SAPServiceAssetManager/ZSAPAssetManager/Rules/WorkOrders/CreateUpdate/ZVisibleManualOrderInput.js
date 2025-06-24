/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
// This rule will show the WO manual input control when the toggle button is switched on. 
export default async function ZVisibleManualOrderInput(context) {
    let CatsTimsheet = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=MyWOHeader');
    return Boolean(CatsTimsheet.getItem(0).ZIsManual);
}