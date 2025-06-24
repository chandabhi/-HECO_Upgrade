
import libCommon from '../Common/Library/CommonLibrary';
import ODataDate from '../Common/Date/ODataDate';
import phaseFilterResult from '../PhaseModel/PhaseModelFilterPickerResult';
import IsPhaseModelEnabled from '../Common/IsPhaseModelEnabled';

export default function NotificationListFilterResults(context) {
    let result1 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:SortFilter/#Value');
    let result2 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:MobileStatusFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:PriorityFilter/#Value');
    let result4 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:TypeFilter/#FilterValue');
    let result5 = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:MinorWorkMobileStatusFilter/#Value');
    
    let filterResults = [result1, result2, result3, result4, result5];

    let creationDateSwitch = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:CreationDateSwitch');

    if (IsPhaseModelEnabled(context)) {
        let phase = context.evaluateTargetPath('#Page:NotificationFilterPage/#Control:PhaseFilter/#Value');
        let result = phaseFilterResult(context, 'PhaseFilter', phase);
        if (result) {
            filterResults.push(result);
        }
    }

    if (creationDateSwitch.getValue() === true) {
        let startDate = libCommon.getFieldValue(context, 'StartDateFilter');
        let sdate = (libCommon.isDefined(startDate)) ? startDate : new Date();
        sdate.setHours(0,0,0,0);
        let odataStartDate = new ODataDate(sdate);
        let odataBackendStartDate =  odataStartDate.toDBDateString(context);

        let endDate = libCommon.getFieldValue(context, 'EndDateFilter');
        let edate = (libCommon.isDefined(endDate)) ? endDate : new Date();
        edate.setHours(0,0,0,0);
        let odataEndDate = new ODataDate(edate);
        let odataBackendEndDate =  odataEndDate.toDBDateString(context);
        odataBackendEndDate = odataBackendEndDate.substring(0,10) + 'T23:59:59';

        let dateFilter = ["CreationDate ge datetime'" + odataBackendStartDate + "' and CreationDate le datetime'" + odataBackendEndDate + "'" ];
        let dateFilterResult = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, dateFilter, true);
        filterResults.push(dateFilterResult);

        let clientData = context.evaluateTargetPath('#Page:NotificationsListViewPage/#ClientData');
        clientData.creationDateSwitch = creationDateSwitch.getValue();
        clientData.startDate = sdate;
        clientData.endDate = edate;
    }

    return filterResults;   
}

