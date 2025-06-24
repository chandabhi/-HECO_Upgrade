/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
// This rule is responsible for the visibility of the Operation list picker, which checks whether the manual toggle is on or off. 
export default async function ZTimeSheetEntryRecOrderVisible(context) {
    let CatsTimsheet = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=MyWOHeader');
    return Boolean(!CatsTimsheet.getItem(0).ZIsManual);
}