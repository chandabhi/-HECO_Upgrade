/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
// We wrote logic in the new custom ZTimeSheetOrder.js rule to update the Manual Operation value and pass it on create and update actions. 
export default function ZTimeSheetOperation(context) {
    let page = `#Page:${context.getPageProxy().currentPage.id}/#Control:ManualOperationInput`;
    if(context.evaluateTargetPath(`${page}`).getValue()){
        let ManualOperationInput =  context.evaluateTargetPath(`${page}`).getValue();
        return ManualOperationInput;
    }
    return '';
}