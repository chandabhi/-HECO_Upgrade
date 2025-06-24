/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
// Show value of manual ord costCenter edit screen. 
export default function ZValueCostCent(context) {
    if(context.binding.ZIsManual&&context.binding.ZRecCCtr){
        return context.binding.ZRecCCtr;
    }
    return '';
}[]