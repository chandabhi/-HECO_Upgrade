import IsNotCompleteAction from '../../WorkOrders/Complete/IsNotCompleteAction';
import CheckForChangesBeforeCancel from '../../Common/CheckForChangesBeforeCancel';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ConfirmationCancelAndroid(context) {
    if (IsNotCompleteAction(context)) {
        context.getAppEventData().cancel = true;
        return CheckForChangesBeforeCancel(context);
    }
}
