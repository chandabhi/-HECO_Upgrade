import libCom from './../../Common/Library/CommonLibrary';
export default function ZTimeSheetCreateUpdateWageTypeChange(context) {

    //HECO
    //Wage types significantly change time entry. They control whether or not time is entered against orders
    // and determine if an overclassification position can be selected
    // let ctrl = context.getPageProxy().getControl('FormCellContainer').getControl('ZWageTypeLstPkr');
    // let wageType = libCom.getListPickerValue(libCom.getControlProxy(context,'ZWageTypeLstPkr').getValue());
    let wageType = context.getPageProxy().getControl('FormCellContainer').getControl('ZWageTypeLstPkr').getValue();
    let orderPicker = context.getPageProxy().getControl('FormCellContainer').getControl('RecOrderLstPkr');
    let operationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('OperationLstPkr');
    let durationPicker = context.getPageProxy().getControl('FormCellContainer').getControl('DurationPkr');
    let startTimePicker = context.getPageProxy().getControl('FormCellContainer').getControl('StartTimePicker');
    let endTimePicker = context.getPageProxy().getControl('FormCellContainer').getControl('EndTimePicker');
    let attendancePicker = context.getPageProxy().getControl('FormCellContainer').getControl('AbsAttLstPkr');
    let positionPicker = context.getPageProxy().getControl('FormCellContainer').getControl('ZEmployeePositionLstPkr');
    let ManualOrderInput = context.getPageProxy().getControl('FormCellContainer').getControl('ManualOrderInput');
    let ManualOperationInput = context.getPageProxy().getControl('FormCellContainer').getControl('ManualOperationInput');
    let ManualCostCenterInput = context.getPageProxy().getControl('FormCellContainer').getControl('ManualCostCenterInput');
    let ManualOrderSwitch = context.getPageProxy().getControl('FormCellContainer').getControl('ManualOrderSwitch');
    // let pageName = libCom.getPageName(context);
    // if(pageName==="TimeEntryCreateUpdatePage"){
    //     ManualOrderSwitch = context.getPageProxy().getControl('FormCellContainer').getControl('ManualOrderSwitch')
    // }

    if (wageType.length == 1) {
        wageType = wageType[0].ReturnValue;

        //Attendance is incompatible with wage types
        attendancePicker.setEditable(false);
        attendancePicker.setValue('');

        //All wage types use duration instead of start/end time
        durationPicker.setEditable(true);
        startTimePicker.setEditable(false);
        endTimePicker.setEditable(false);


        //Order selections are only available for wage type 1104
        if (wageType == '1104') {
            ManualOrderSwitch?.setEditable(true);
            orderPicker.setEditable(true);
            orderPicker.setVisible(true);
            operationPicker.setVisible(true);
            operationPicker.setEditable(true);
            ManualOrderInput.setEditable(true);
            ManualOperationInput.setEditable(true);
            ManualCostCenterInput.setEditable(true);

        } else {
            orderPicker.setEditable(false);
            orderPicker.setValue('');
            operationPicker.setEditable(false);
            operationPicker.setValue('');
            ManualOrderSwitch?.setEditable(false);
            ManualOrderSwitch?.setValue(false);
            ManualOrderInput.setEditable(false);
            ManualOrderInput.setValue('');
            ManualOperationInput.setEditable(false);
            ManualOperationInput.setValue('');
            ManualCostCenterInput.setEditable(false);
            ManualCostCenterInput.setValue('');
        }

        //Overclassification position is allowed for the following wage types
        if (wageType == '1104'
            || wageType == '1114'
            || wageType == '1115'
            || wageType == '1116'
            || wageType == '1117'
            || wageType == '1134'
            || wageType == '1135'
            || wageType == '1136'
            || wageType == '1158'
            || wageType == '2007') {
            positionPicker.setEditable(true);
        } else {
            positionPicker.setEditable(false);
            positionPicker.setValue('');
        }
    } else { //No wage type selected
        
        attendancePicker.setEditable(true);
        orderPicker.setEditable(true);
        operationPicker.setEditable(true);

        //Normal time entry uses start/end time
        durationPicker.setEditable(false);
        startTimePicker.setEditable(true);
        endTimePicker.setEditable(true);

        //Overclassification allowed for time entry
        positionPicker.setEditable(true);

        //Set Editable true for manual controls as we uncheck/deseclect wagetype.
        ManualOrderSwitch?.setEditable(true);
        ManualOrderInput.setEditable(true);
        ManualOperationInput.setEditable(true);
        ManualCostCenterInput.setEditable(true);
    }


}

