import FilterOnLoaded from '../../../Filter/FilterOnLoaded';

export default function ServiceOrderFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded

    let clientData = context.evaluateTargetPath('#Page:ServiceOrdersListViewPage/#ClientData');
    let reqDateSwitch = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:DueDateSwitch');

    if (clientData && clientData.reqDateSwitch !== undefined) {
        let reqStartDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:ReqStartDateFilter');
        let reqEndDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:ReqEndDateFilter');

        reqDateSwitch.setValue(clientData.reqDateSwitch);
        reqStartDateControl.setValue(clientData.reqStartDate);
        reqEndDateControl.setValue(clientData.reqEndDate);

        reqStartDateControl.setVisible(clientData.reqDateSwitch);
        reqEndDateControl.setVisible(clientData.reqDateSwitch);
    }

    if (clientData && clientData.dueDateSwitch !== undefined) {
        let dueStartDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:DueStartDateFilter');
        let dueEndDateControl = context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:DueEndDateFilter');

        dueDateSwitch.setValue(clientData.dueDateSwitch);
        dueStartDateControl.setValue(clientData.dueStartDate);
        dueEndDateControl.setValue(clientData.dueEndDate);

        dueStartDateControl.setVisible(clientData.dueDateSwitch);
        dueEndDateControl.setVisible(clientData.dueDateSwitch);
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:ServiceOrderFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }
}
