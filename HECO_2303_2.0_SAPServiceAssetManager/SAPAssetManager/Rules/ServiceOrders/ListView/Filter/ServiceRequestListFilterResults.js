import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ODataDate from '../../../Common/Date/ODataDate';

export default function ServiceRequestListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:PriorityFilter/#Value');

    let reqDateSwitch = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:RequestStartDateSwitch');
    let dueDateSwitch = context.evaluateTargetPath('#Page:ServiceRequestFilterPage/#Control:DueDateSwitch');
    
    let filterResults = [result1, result2, result3];

    if (reqDateSwitch.getValue() === true) {
        let startDate = CommonLibrary.getFieldValue(context, 'ReqStartDateFilter');
        let odataStartDate = formatControlDateIntoDBDate(context, startDate);

        let endDate = CommonLibrary.getFieldValue(context, 'ReqEndDateFilter');
        let odataEndDate = formatControlDateIntoDBDate(context, endDate);

        let dateFilter = ["RequestedStart ge datetime'" + odataStartDate + "' and RequestedEnd le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        let clientData = context.evaluateTargetPath('#Page:ServiceRequestsListViewPage/#ClientData');
        clientData.reqDateSwitch = reqDateSwitch.getValue();
        clientData.reqStartDate = odataStartDate;
        clientData.reqEndDate = odataEndDate;
    }

    if (dueDateSwitch.getValue() === true) {
        let startDate = CommonLibrary.getFieldValue(context, 'DueStartDateFilter');
        let odataStartDate = formatControlDateIntoDBDate(context, startDate);

        let endDate = CommonLibrary.getFieldValue(context, 'DueEndDateFilter');
        let odataEndDate = formatControlDateIntoDBDate(context, endDate);

        let dateFilter = ["DueBy ge datetime'" + odataStartDate + "' and DueBy le datetime'" + odataEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        let clientData = context.evaluateTargetPath('#Page:ServiceRequestsListViewPage/#ClientData');
        clientData.dueDateSwitch = dueDateSwitch.getValue();
        clientData.dueStartDate = odataStartDate;
        clientData.dueEndDate = odataEndDate;
    }

    return filterResults;
}

function formatControlDateIntoDBDate(context, controlDate) {
    let date = (controlDate === '') ? new Date() : new Date(controlDate);
    let odataDate = new ODataDate(date);
    return odataDate.toLocalDateString(context);
}
