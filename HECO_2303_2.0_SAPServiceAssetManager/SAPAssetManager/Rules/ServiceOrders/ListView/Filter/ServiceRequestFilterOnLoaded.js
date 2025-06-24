import FilterOnLoaded from '../../../Filter/FilterOnLoaded';

export default function ServiceRequestFilterOnLoaded(context) {
    FilterOnLoaded(context); //Run the default filter on loaded

    let clientData = context.evaluateTargetPath('#Page:ServiceRequestsListViewPage/#ClientData');
    let reqDateSwitch = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueDateSwitch');

    if (clientData && clientData.reqDateSwitch !== undefined) {
        let reqStartDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:ReqStartDateFilter');
        let reqEndDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:ReqEndDateFilter');

        reqDateSwitch.setValue(clientData.reqDateSwitch);
        reqStartDateControl.setValue(clientData.reqStartDate);
        reqEndDateControl.setValue(clientData.reqEndDate);

        reqStartDateControl.setVisible(clientData.reqDateSwitch);
        reqEndDateControl.setVisible(clientData.reqDateSwitch);
    }

    if (clientData && clientData.dueDateSwitch !== undefined) {
        let dueStartDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueStartDateFilter');
        let dueEndDateControl = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueEndDateFilter');

        dueDateSwitch.setValue(clientData.dueDateSwitch);
        dueStartDateControl.setValue(clientData.dueStartDate);
        dueEndDateControl.setValue(clientData.dueEndDate);

        dueStartDateControl.setVisible(clientData.dueDateSwitch);
        dueEndDateControl.setVisible(clientData.dueDateSwitch);
    }

    if (clientData && clientData.predefinedStatus) {
        context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:MobileStatusFilter').setValue(clientData.predefinedStatus);
        clientData.predefinedStatus = '';
    }
}
