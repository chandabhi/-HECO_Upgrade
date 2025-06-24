import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function NavOnCompleteServiceOrderPage(context, actionBinding) {
    let binding = actionBinding || CommonLibrary.getBindingObject(context);

    WorkOrderCompletionLibrary.getInstance().setCompletionFlow('service_order');
    WorkOrderCompletionLibrary.getInstance().initSteps(context);
    WorkOrderCompletionLibrary.getInstance().setBinding(context, binding);
    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(context, true);

    return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false);
}
