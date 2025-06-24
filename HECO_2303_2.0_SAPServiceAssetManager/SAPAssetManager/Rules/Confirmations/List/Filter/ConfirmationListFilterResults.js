export default function ConfirmationListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:AssignedToPicker/#FilterValue');
    
    let filterResults = [result1, result2];
    
    let statusLstPickerValues = context.evaluateTargetPath('#Page:ConfirmationListFilterPage/#Control:StatusLstPicker/#Value');
    let clientData = context.evaluateTargetPath('#Page:S4ConfirmationsListViewPage/#ClientData');

    if (statusLstPickerValues.length) {
        statusLstPickerValues.forEach((val) => {
            let filterValues = [val.ReturnValue];
            let filterValuesResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, filterValues, true);
            filterResults.push(filterValuesResult);
        });
        clientData.statusLstPickerValues = statusLstPickerValues.map(val => val.ReturnValue);
    }

    return filterResults;
}
