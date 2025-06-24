import ODataDate from '../../Common/Date/ODataDate';
import libCom from '../../Common/Library/CommonLibrary';

export function GetDateIntervalFilterValueDateAndTime(context, clientData, pageName, dateFilterPropName, timeFilterPropName, visibilitySwitchName, datepickerStartControlName, datepickerEndControlName) {
    /** if the visibility switch is on, then return a filtercritera for the validFrom and validTo DATE AND TIME filters and save their control values in clientdata */
    let visibilitySwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:${visibilitySwitchName}`);

    if (visibilitySwitch.getValue() === true) {
        const [start, end] = [datepickerStartControlName, datepickerEndControlName].map(name => {
            let pickerValue = libCom.getFieldValue(context, name);
            return pickerValue ? new Date(pickerValue) : new Date();
        });

        const [oStart, oEnd] = [start, end].map(i => new ODataDate(i));

        clientData[visibilitySwitchName] = visibilitySwitch.getValue();
        clientData[datepickerStartControlName] = start;
        clientData[datepickerEndControlName] = end;
        const day = dateFilterPropName;
        const time = timeFilterPropName;

        const startDay = `datetime'${oStart.toDBDateString(context)}'`;
        const endDay = `datetime'${oEnd.toDBDateString(context)}'`;
        const startTime = `time'${oStart.toEDMTimeString(context)}'`;
        const endTime = `time'${oEnd.toEDMTimeString(context)}'`;

        let dateFilter = [`(${day} gt ${startDay} or (${day} eq ${startDay} and ${time} ge ${startTime})) and ` +
                          `(${day} lt ${endDay} or (${day} eq ${endDay} and ${time} le ${endTime}))`];
        return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
    }
}

export function GetDateIntervalFilterValueDate(context, clientData, pageName, dateFilterPropName, visibilitySwitchName, datepickerStartControlName, datepickerEndControlName) {
    /** if the visibility switch is on, then return a filtercritera for the validFrom and validTo DATE filters and save their control values in clientdata */
    let visibilitySwitch = context.evaluateTargetPath(`#Page:${pageName}/#Control:${visibilitySwitchName}`);

    if (visibilitySwitch.getValue() === true) {
        const [start, end] = [datepickerStartControlName, datepickerEndControlName].map(name => {
            let pickerValue = libCom.getFieldValue(context, name);
            return pickerValue ? new Date(pickerValue) : new Date();
        });

        const [oStart, oEnd] = [start, end].map(i => new ODataDate(i));

        clientData[visibilitySwitchName] = visibilitySwitch.getValue();
        clientData[datepickerStartControlName] = start;
        clientData[datepickerEndControlName] = end;
        const day = dateFilterPropName;

        const startDay = `datetime'${oStart.toDBDateString(context)}'`;
        const endDay = `datetime'${oEnd.toDBDateString(context)}'`;

        let dateFilter = [`(${day} ge ${startDay}) and ` +
                          `(${day} le ${endDay})`];
        return context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
    }
}
