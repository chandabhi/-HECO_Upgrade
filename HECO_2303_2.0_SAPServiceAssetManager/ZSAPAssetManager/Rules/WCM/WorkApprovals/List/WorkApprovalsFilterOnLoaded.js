import filterOnLoaded from '../../../Filter/FilterOnLoaded';

export default function WorkApprovalsFilterOnLoaded(context) {
    
    filterOnLoaded(context); 

    let clientData = context.evaluateTargetPath('#Page:WorkApprovalsListViewPage/#ClientData');
    
    Object.entries({
        ValidFromFilterVisibleSwitch: ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
        ValidToFilterVisibleSwitch: ['ValidToDatePickerStart', 'ValidToDatePickerEnd'],
    }).forEach(([visibility, datePickers]) => datePickers.forEach(datePicker => setDatePicker(context, clientData, 'WorkApprovalsFilterPage', visibility, datePicker)));

}

export function setDatePicker(context, clientData, pageName, visibleSwitchName, datepickerName) {

    let visibleSwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:${visibleSwitchName}`);

    if (clientData && clientData[visibleSwitchName] !== undefined) {
        visibleSwitch.setValue(clientData[visibleSwitchName]);

        let datepickerControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:${datepickerName}`);
        datepickerControl.setValue(clientData[datepickerName]||'');
        datepickerControl.setVisible(clientData[visibleSwitchName]);
    }
}
