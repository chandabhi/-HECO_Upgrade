import libEval from '../../Common/Library/ValidationLibrary';

export default function FSMOperationFilterOnValueChange(context) {
    let opSelection = context.getValue()[0] ? context.getValue()[0].ReturnValue : '';
    let clientData = context.evaluateTargetPath('#Page:FSMSmartFormsInstancesListViewPage/#ClientData');
    clientData.operationFilter = libEval.evalIsEmpty(opSelection) ? undefined : opSelection;
}
