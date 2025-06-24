/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
// In this rule, we pass the given manual cost center value to the create/update action from the confirmation create/update page 
export default function ZTimeSheetCostCenter(context) {
    let page = `#Page:${context.getPageProxy().currentPage.id}`;
    if(context.evaluateTargetPath(page+'/#Control:ManualOrderSwitch')?.getValue()&&context.evaluateTargetPath(page+'/#Control:ManualCostCenterInput').getValue()){
        let ManualCostCenterInput = context.evaluateTargetPath(page+'/#Control:ManualCostCenterInput').getValue();
        return ManualCostCenterInput;
    }
    return '';
}