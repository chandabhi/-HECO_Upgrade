/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function ZIsManual(context) {
    let page = `#Page:${context.getPageProxy().currentPage.id}`;
    if(context.evaluateTargetPath(page+'/#Control:ManualOrderSwitch')?.getValue()){
        return true;
    }
    return false;
}