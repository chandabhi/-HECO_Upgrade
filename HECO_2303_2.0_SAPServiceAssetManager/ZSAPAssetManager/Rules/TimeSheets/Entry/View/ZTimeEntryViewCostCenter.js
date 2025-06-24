/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ZTimeEntryViewCostCenter(context) {
    if(context.binding&&context.binding.ZRecCCtr){
        return context.binding.ZRecCCtr;
    }
    else{
        '';
    }
}