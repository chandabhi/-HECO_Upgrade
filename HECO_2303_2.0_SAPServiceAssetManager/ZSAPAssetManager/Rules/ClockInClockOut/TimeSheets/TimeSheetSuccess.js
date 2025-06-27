import libClock from '../../../../SAPAssetManager/Rules/ClockInClockOut/ClockInClockOutLibrary';
import libCommon from '../../../../SAPAssetManager/Rules/Common/Library/CommonLibrary';
import ExecuteActionWithAutoSync from '../../../../SAPAssetManager/Rules/ApplicationEvents/AutoSync/ExecuteActionWithAutoSync';
import IsCompleteAction from '../../../../SAPAssetManager/Rules/WorkOrders/Complete/IsCompleteAction';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import GetDuration from '../../../../SAPAssetManager/Rules/Confirmations/CreateUpdate/OnCommit/GetDuration';
import ConvertDoubleToHourString from '../../../../SAPAssetManager/Rules/Confirmations/ConvertDoubleToHourString';

export default function TimeSheetSuccess(context) {
    let result = context.getActionResult('actionResult').data; //Timesheet row that was just created
    //Handle removing clock in/out records after time entry
    libCommon.setStateVariable(context, 'ClockTimeSaved', true);
    return libClock.removeUserTimeEntries(context).then(() => {
        if (IsCompleteAction(context)) {
            WorkOrderCompletionLibrary.updateStepState(context, 'time', {
                data: result,
                link: JSON.parse(result)['@odata.editLink'],
                value: ConvertDoubleToHourString(GetDuration(context)),
            });
            return WorkOrderCompletionLibrary.getInstance().openMainPage(context);
        }
        //Regular time entry, not part of consolidated completion flow
         // Added Flag to manage crash to resolve and close page only once
        if(context.binding&&!context.binding.ModalPageClosedOnce){
            context.binding.ModalPageClosedOnce = true
        }
        return ExecuteActionWithAutoSync(context, '/SAPAssetManager/Actions/TimeSheets/TimeSheetEntrySuccessMessage.action');
    });
}
