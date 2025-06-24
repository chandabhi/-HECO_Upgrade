import { GetDateIntervalFilterValueDateAndTime } from '../Common/GetDateIntervalFilterValue';


export default function WorkPermitFilterResults(context) {
    /** return an array of FilterCriterias
     * get the filterCriterias from the filter controls, create new ones for work type and work requirement and validfrom-validto filters
     * save the date filters' values to clientdata */
    let filterResults = ['SortFilter', 'ApprovalStatusFilter', 'PriorityFilter', 'HeaderStatusFilter', 'UsageFilter']
            .map(controlName => context.evaluateTargetPath(`#Page:WorkPermitsFilterPage/#Control:${controlName}/#Value`))  // FormCell.Filter
            .concat(['FunctionalLocationFilter', 'EquipmentFilter']
                .map(controlName => context.evaluateTargetPath(`#Page:WorkPermitsFilterPage/#Control:${controlName}/#FilterValue`)))  // FormCell.ListPicker
            .concat(['WorkType1Filter', 'WorkType2Filter', 'Requirements1Filter', 'Requirements2Filter']
                .map(controlName => [controlName, context.evaluateTargetPath(`#Page:WorkPermitsFilterPage/#Control:${controlName}/#Value`)])  // hack: create custom query instead of the FilterProperty-driven one from listpicker
                .map(([controlName, selectedItems]) => selectedItems && selectedItems.length > 0 ? context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, [JoinWorkReqFilters(selectedItems)], true, controlName) : undefined));

    let clientData = context.evaluateTargetPath('#Page:WorkPermitsListViewPage/#ClientData');

    return filterResults.concat([['ValidFrom', 'ValidFromTime', 'ValidFromFilterVisibleSwitch', 'ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
                                 ['ValidTo', 'ValidToTime', 'ValidToFilterVisibleSwitch', 'ValidToDatePickerStart', 'ValidToDatePickerEnd']]
                                .map(params => GetDateIntervalFilterValueDateAndTime(context, clientData, 'WorkPermitsFilterPage', ...params)))
                                .filter(x => x !== undefined);
}

function JoinWorkReqFilters(selectedItems) {
    /** create filterTerm from the selected worktypes or workrequirements */
    return selectedItems.map(i => `(WCMRequirements/${i.ReturnValue} ne '')`).join('or');
}

export function SplitWorkReqFilters(queryString) {
    /** parse the selected worktypes and requirements from the filterterm created by JoinWorkReqFilters */
    const regexp = /WCMRequirements\/([a-zA-Z]+)\b\ ne ''/g;
    return Array.from(queryString.matchAll(regexp), x => x[1]);
}
