/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ZTimeSheetEntryOperationLstPkrVisible(context) {
    if(context.binding.Operation||context.binding.ZRecCCtr){
        return false;
    }
    return true;
}