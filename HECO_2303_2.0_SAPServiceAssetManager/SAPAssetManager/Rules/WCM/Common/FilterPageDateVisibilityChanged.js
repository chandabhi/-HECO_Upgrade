import DatePickerVisibleSwitchChanged from './DatePickerVisibleSwitchChanged';

export default function FilterPageDateVisibilityChanged(context,filterPageName,listPageName) {
    const name = context.getName();
    const isVisible = DatePickerVisibleSwitchChanged(context, filterPageName, name);

    let clientData = context.evaluateTargetPath(`#Page:${listPageName}/#ClientData`);
    clientData[name] = isVisible;
}
