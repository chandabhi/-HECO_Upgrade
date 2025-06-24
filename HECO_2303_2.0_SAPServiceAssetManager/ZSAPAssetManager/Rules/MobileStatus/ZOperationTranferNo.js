/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ZOperationTranferNo(context){
    if(context.binding['@odata.type'] ==="#sap_mobile.MyWorkOrderHeader"&&context.binding.OrderType==="TC01"&&context.binding.Operations[0]){
        return context.binding.Operations[0].OperationNo;
    }
    return context.binding.OperationNo;

}