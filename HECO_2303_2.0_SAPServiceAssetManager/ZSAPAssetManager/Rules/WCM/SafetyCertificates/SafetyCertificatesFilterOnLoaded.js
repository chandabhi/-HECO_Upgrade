import filterOnLoaded from '../../Filter/FilterOnLoaded';

export default function SafetyCertificatesFilterOnLoaded(context) {
    
    filterOnLoaded(context); //Run the default filter on loaded

    let clientData = context.evaluateTargetPath('#Page:SafetyCertificatesListViewPage/#ClientData');
    
    Object.entries({
        ValidFromFilterVisibleSwitch: ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'],
        ValidToFilterVisibleSwitch: ['ValidToDatePickerStart', 'ValidToDatePickerEnd'],
    }).forEach(([visibility, datePickers]) => datePickers.forEach(datePicker => setDatePicker(context, clientData, 'SafetyCertificatesFilterPage', visibility, datePicker)));
}

export function setDatePicker(context, clientData, pageName, visibleSwitchName, datepickerName) {

    let visibleSwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:${visibleSwitchName}`);

    if (clientData && clientData[visibleSwitchName] !== undefined) {
        visibleSwitch.setValue(clientData[visibleSwitchName]);

        let datepickerControl = context.evaluateTargetPath(`#Page:${pageName}/#Control:${datepickerName}`);
        datepickerControl.setValue(clientData[datepickerName] || '');
        datepickerControl.setVisible(clientData[visibleSwitchName]);
    }
}
