import filterOnLoaded from '../../Filter/FilterOnLoaded';
import { setDatePicker } from '../SafetyCertificates/SafetyCertificatesFilterOnLoaded';
import { SplitWorkReqFilters } from './WorkPermitFilterResults';

export default function WorkPermitFilterOnLoaded(context) {
    filterOnLoaded(context);

    let clientData = context.evaluateTargetPath('#Page:WorkPermitsListViewPage/#ClientData');

    Object.entries({
        ValidFromFilterVisibleSwitch: ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
        ValidToFilterVisibleSwitch: ['ValidToDatePickerStart', 'ValidToDatePickerEnd'],
    }).forEach(([visibility, datePickers]) => datePickers.forEach(datePicker => setDatePicker(context, clientData, 'WorkPermitsFilterPage', visibility, datePicker)));
    
    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters) {
        return;
    }
    ['WorkType1Filter', 'WorkType2Filter', 'Requirements1Filter', 'Requirements2Filter'].forEach(controlName => {  // hack: set the listpicker selected items according to the filters created in the WorkPermitFilterResults rule
        const filterForControl = filters.find(f => f.type === context.filterTypeEnum.Filter && f.label === controlName && f.filterItems.length > 0);
        if (filterForControl) {
            context.getControl('FormCellContainer').getControl(controlName).setValue(SplitWorkReqFilters(filterForControl.filterItems[0]));
        }
    });
}
