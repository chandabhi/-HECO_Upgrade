import IsWONotificationVisible from './Complete/Notification/IsWONotificationVisible';
import WorkOrderCompletionLibrary from './Complete/WorkOrderCompletionLibrary';
import libCommon from '../Common/Library/CommonLibrary';
import {ChecklistLibrary} from '../Checklists/ChecklistLibrary';

export default function NavOnCompleteWorkOrderPage(context, actionBinding) {
    let binding = actionBinding || libCommon.getBindingObject(context);

    return ChecklistLibrary.allowWorkOrderComplete(context, binding.HeaderEquipment, binding.HeaderFunctionLocation).then(results => { //Check for non-complete checklists and ask for confirmation
        if (results === true) {
            WorkOrderCompletionLibrary.getInstance().setCompletionFlow('');
            WorkOrderCompletionLibrary.getInstance().initSteps(context);
            WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);
            return IsWONotificationVisible(context, binding, 'Notification').then((notification) => {
                if (notification) {
                    WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                        visible: true,
                        data: JSON.stringify(notification),
                        link: notification['@odata.editLink'],
                        initialData: JSON.stringify(notification),
                    });
                } else {
                    WorkOrderCompletionLibrary.updateStepState(context, 'notification', {
                        visible: false,
                    });
                }
                WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);
                return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
            });
        }
        return false;
    });
}
