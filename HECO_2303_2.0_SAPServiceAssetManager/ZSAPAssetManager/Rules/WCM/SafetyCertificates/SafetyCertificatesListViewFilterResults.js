import { GetDateIntervalFilterValueDateAndTime } from '../Common/GetDateIntervalFilterValue';


export default function SafetyCertificatesListViewFilterResults(context) {
    let filterResults = ['SortFilter', 'ApprovalStatusFilter', 'PriorityFilter', 'UsageFilter']
            .map(controlName => context.evaluateTargetPath(`#Page:SafetyCertificatesFilterPage/#Control:${controlName}/#Value`))  // FormCell.Filter
        .concat(['FunctionalLocationFilter', 'EquipmentFilter', 'ActualSystemStatus']
            .map(controlName => context.evaluateTargetPath(`#Page:SafetyCertificatesFilterPage/#Control:${controlName}/#FilterValue`)));  // FormCell.ListPicker


    let clientData = context.evaluateTargetPath('#Page:SafetyCertificatesListViewPage/#ClientData');

    return filterResults.concat([['ValidFromDate', 'ValidFromTime', 'ValidFromFilterVisibleSwitch', 'ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
                                 ['ValidToDate', 'ValidToTime', 'ValidToFilterVisibleSwitch', 'ValidToDatePickerStart', 'ValidToDatePickerEnd']]
                                .map(params => GetDateIntervalFilterValueDateAndTime(context, clientData, 'SafetyCertificatesFilterPage', ...params)))
                                .filter(x => x !== undefined);
}
