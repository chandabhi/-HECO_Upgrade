import common from '../../Common/Library/CommonLibrary';

export default function PhaseControlOnValueChange(context) {
    //set clientdata for filter
    let page = context.getPageProxy();
    let formCellContainer = page.getControl('FormCellContainer');
    let clientData = page.evaluateTargetPath('#Page:-Previous/#ClientData');

    let selection = context.getValue();
    let control = common.getPageName(page) === 'WorkOrderOperationsFilterPage' ? '#Control:OrderTypeFilter/#Value' : '#Control:TypeFilter/#Value';
    let appParam = common.getPageName(page) === 'WorkOrderOperationsFilterPage' ? 'Operation' : 'WorkOrder';
    let orderTypeSelection = page.evaluateTargetPath(control);

    let controlKeyFilterPicker = formCellContainer.getControl('ControlKeyFilter');
    let controlKeySpecifier = controlKeyFilterPicker.getTargetSpecifier();

    if (selection.length > 0) {
        // Save selected values
        clientData.phaseControlFilterValue = selection.map(element => element.ReturnValue);

        // Build Phase Control and Control Key filter strings
        let controlKeyFilter = selection.map(element => `PhaseControl eq '${element.ReturnValue}'`).join(' or ');
        let phaseControlFilter = orderTypeSelection.map(element => `OrderType eq '${element.ReturnValue}'`).join(' or ');

        // Re-set query options and enable picker
        controlKeySpecifier.setQueryOptions(`$expand=PhaseControlKey_Nav&$filter=Entity eq '${common.getAppParam(context, 'OBJECTTYPE',appParam)}' and (${phaseControlFilter}) and (${controlKeyFilter})`);
        controlKeyFilterPicker.setEditable(true);
        return controlKeyFilterPicker.setTargetSpecifier(controlKeySpecifier);
    } else {
        // Disable Control Key picker and set its value to blank
        controlKeyFilterPicker.setEditable(false);
        controlKeyFilterPicker.setValue('');
        // Remove Phase Control Filter values from client data
        clientData.phaseControlFilterValue = [];
        return Promise.resolve();
    }
}
