import { GetDateIntervalFilterValueDateAndTime } from '../../Common/GetDateIntervalFilterValue';

export default function WorkApprovalsListViewFilterResults(context) {
    //collecting sorting and filters from FormCell.Sorter and FormCell.Filter
    let filterResults = ['SortFilter']
            .map(controlName => context.evaluateTargetPath(`#Page:WorkApprovalsFilterPage/#Control:${controlName}/#Value`))  
        .concat(['HeaderStatusFilter', 'FunctionalLocationFilter','EquipmentFilter']
            .map(controlName => context.evaluateTargetPath(`#Page:WorkApprovalsFilterPage/#Control:${controlName}/#FilterValue`))); //collecting filters from FormCell.ListPicker

    let clientData = context.evaluateTargetPath('#Page:WorkApprovalsListViewPage/#ClientData');
    //get values from DatePickers
    return filterResults.concat([['ValidFrom', 'ValidFrmTime', 'ValidFromFilterVisibleSwitch', 'ValidFromDatePickerStart', 'ValidFromDatePickerEnd'], 
                                 ['ValidTo', 'ValidToTime', 'ValidToFilterVisibleSwitch', 'ValidToDatePickerStart', 'ValidToDatePickerEnd']]
                                .map(params => GetDateIntervalFilterValueDateAndTime(context, clientData, 'WorkApprovalsFilterPage', ...params)) 
                                .filter(x => x !== undefined));
}
