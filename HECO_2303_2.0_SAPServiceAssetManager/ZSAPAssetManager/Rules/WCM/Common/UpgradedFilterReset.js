import FilterReset from '../../Filter/FilterReset';
export default function UpgradedFilterReset(context, pageName) {
    FilterReset(context);

    let clientData = context.evaluateTargetPath(`#Page:${pageName}/#ClientData`);

    if (clientData && clientData.ValidFromFilterVisibleSwitch !== undefined) {
        clientData.ValidFromFilterVisibleSwitch = undefined;
        clientData.ValidFromDatePickerStart = '';
        clientData.ValidFromDatePickerEnd = '';
    }
    if (clientData && clientData.ValidToFilterVisibleSwitch !== undefined) {
        clientData.ValidToFilterVisibleSwitch = undefined;
        clientData.ValidToDatePickerStart = '';
        clientData.ValidToDatePickerEnd = '';
    }

    let formCellContainer = context.getPageProxy().getControl('FormCellContainer');  
    formCellContainer.getControl('ValidFromFilterVisibleSwitch').setValue(false);
    formCellContainer.getControl('ValidToFilterVisibleSwitch').setValue(false);
}
