
export default function DatePickerVisibleSwitchChanged(context, pageName, visibilitySwitchName) {
    let controls = '';
    switch (visibilitySwitchName) {
        case 'ValidFromFilterVisibleSwitch':
            controls = ['ValidFromDatePickerStart', 'ValidFromDatePickerEnd'];
            break;
        case 'ValidToFilterVisibleSwitch':
            controls = ['ValidToDatePickerStart', 'ValidToDatePickerEnd'];
            break;
        default:
            break;
    }
    const isVisible = context.evaluateTargetPathForAPI(`#Page:${pageName}/#Control:${visibilitySwitchName}`).getValue();
    controls.forEach(controlName => SetVisibility(context, pageName, isVisible, controlName));
    return isVisible;
}

function SetVisibility(context, pageName, isVisible, targetPathControl) {
    
    let datePicker = context.evaluateTargetPathForAPI(`#Page:${pageName}/#Control:${targetPathControl}`);
    datePicker.setVisible(isVisible);
    datePicker.redraw();
}
