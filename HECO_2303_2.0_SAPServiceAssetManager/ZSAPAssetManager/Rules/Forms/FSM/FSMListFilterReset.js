import libCom from '../../Common/Library/CommonLibrary';
import FilterReset from '../../Filter/FilterReset';

export default function FSMListFilterReset(context) {
    let operationFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:OperationFilter');
    if (context.binding && context.binding.OrderId) {
        operationFilter.setValue('');
    } else {
        libCom.setFormcellNonEditable(operationFilter);
    }

    let workOrderFilter = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:WorkOrderFilter');
    workOrderFilter.setValue('');

    let clientData = context.evaluateTargetPath('#Page:FSMSmartFormsInstancesListViewPage/#ClientData');

    if (clientData && clientData.workOrderFilter !== undefined) {
        clientData.workOrderFilter = undefined;
    }

    if (clientData && clientData.operationFilter !== undefined) {
        clientData.operationFilter = undefined;
    }

    FilterReset(context);
}
