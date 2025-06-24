import libCom from '../../Common/Library/CommonLibrary';
import libEval from '../../Common/Library/ValidationLibrary';

export default function FSMFilteringResult(context) {
    let result1 = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:SortFilter/#Value');
    let filterResults = [result1];
    let pageProxy = context.getPageProxy();

    let woListPickerProxy = libCom.getControlProxy(pageProxy, 'WorkOrderFilter');
    let woSelection = woListPickerProxy.getValue()[0] ? woListPickerProxy.getValue()[0].ReturnValue : '';
    if (!libEval.evalIsEmpty(woSelection)) {
        let woFilter = ["WorkOrder eq '" + woSelection + "'"];
        let woFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, woFilter, true);
        filterResults.push(woFilterResult);
    }

    let opListPickerProxy = libCom.getControlProxy(pageProxy, 'OperationFilter');
    let opSelection = opListPickerProxy.getValue()[0] ? opListPickerProxy.getValue()[0].ReturnValue : '';
    if (!libEval.evalIsEmpty(opSelection)) {
        let opFilter = ["Operation eq '" + opSelection + "'"];
        let opFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, opFilter, true);
        filterResults.push(opFilterResult);
    }

    let result2 = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:FSMTypeFilter/#Value');
    filterResults.push(result2);

    let result3 = context.evaluateTargetPath('#Page:FSMFilterPage/#Control:FSMStatusFilter/#Value');
    filterResults.push(result3);

    return filterResults;
}
