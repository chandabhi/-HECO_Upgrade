/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
//  We wrote logic in the new custom ZTimeSheetOrder.js rule to update the Manual Order value and pass it on create and update actions. 
export default function ZTimeSheetOrder(context) {
    let page = `#Page:${context.getPageProxy().currentPage.id}/#Control:ManualOrderInput`;
    if(context.evaluateTargetPath(`${page}`).getValue()){
        let ManualOrderInput =  context.evaluateTargetPath(`${page}`).getValue();
        return ManualOrderInput;
    }
    
    return '';
}