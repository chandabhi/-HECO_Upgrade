import IsNotCompleteAction from '../../WorkOrders/Complete/IsNotCompleteAction';
import CheckForChangesBeforeClose from '../../Common/CheckForChangesBeforeClose';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function TimeSheetCloseAndroid(context) {
    if (IsNotCompleteAction(context)) {
        context.getAppEventData().cancel = true;
        return CheckForChangesBeforeClose(context);
    }
}
