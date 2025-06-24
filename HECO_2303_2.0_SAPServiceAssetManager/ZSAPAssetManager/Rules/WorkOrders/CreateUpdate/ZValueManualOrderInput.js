/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
// Show value of manual order in edit screen. 
export default async function ZValueManualOrderInput(context) {
    let CatsTimsheet = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=MyWOHeader')
    if(CatsTimsheet.getItem(0).ZIsManual){
        return CatsTimsheet.getItem(0).RecOrder;
    }
    return '';
}