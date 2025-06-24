import libCom from "../../Common/Library/CommonLibrary";
// Hide or Display fields if Manual Entry toggle is selected on Time Entry screen 
export default function ZWorkOrderCreateUpdateManualEntry(context) {
    let pageName = libCom.getPageName(context)
    let manualEntry = context.evaluateTargetPath('#Page:'+pageName+'/#Control:ManualOrderSwitch').getValue();
    let manualOrder = context.evaluateTargetPath('#Page:'+pageName+'/#Control:ManualOrderInput')
    let ManualOperationInput = context.evaluateTargetPath('#Page:'+pageName+'/#Control:ManualOperationInput')
    let ManualCostCenterInput = context.evaluateTargetPath('#Page:'+pageName+'/#Control:ManualCostCenterInput')
    let orderPicker = context.evaluateTargetPath('#Page:'+pageName+'/#Control:RecOrderLstPkr');
    let operationPicker = context.evaluateTargetPath('#Page:'+pageName+'/#Control:OperationLstPkr');
    let activityPicker = context.evaluateTargetPath('#Page:'+pageName+'/#Control:ActivityTypeLstPkr');

    if(manualEntry) {
        manualOrder.setVisible(true);
        ManualOperationInput.setVisible(true);
        ManualCostCenterInput.setVisible(true);
        // orderPicker.setValue('');
        // operationPicker.setValue('');
        orderPicker.setVisible(false);
        operationPicker.setVisible(false);
        activityPicker.setVisible(false);
    } else {
        manualOrder.setVisible(false);
        orderPicker.setVisible(true);
        operationPicker.setVisible(true);
        // activityPicker.setVisible(true);
        ManualOperationInput.setVisible(false);
        ManualCostCenterInput.setVisible(false);
        // manualOrder.setValue('');
        // ManualOperationInput.setValue('');
        // ManualCostCenterInput.setValue('');
    }
}
