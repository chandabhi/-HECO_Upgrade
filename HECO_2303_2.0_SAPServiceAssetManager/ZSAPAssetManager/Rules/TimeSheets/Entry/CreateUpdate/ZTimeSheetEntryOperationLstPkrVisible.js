/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default async function ZTimeSheetEntryOperationLstPkrVisible(context) {
    let CatsTimsheet = await context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], '$expand=MyWOHeader');
    return Boolean(!CatsTimsheet.getItem(0).ZIsManual);
}