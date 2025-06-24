import WorkOrderCompletionLibrary from '../WorkOrderCompletionLibrary';
import ServiceConfirmationLibrary from '../../../ServiceConfirmations/CreateUpdate/ServiceConfirmationLibrary';
import ServiceConfirmationItemUpdateNav from '../../../ServiceConfirmations/CreateUpdate/ServiceConfirmationItemUpdateNav';

export default function ChangeConfirmation(context) {
    let pageProxy = context.getPageProxy();

    if (WorkOrderCompletionLibrary.isStepDataExist(pageProxy, 'confirmation_item')) {
        pageProxy.setActionBinding(WorkOrderCompletionLibrary.getStepData(pageProxy, 'confirmation_item'));
        return ServiceConfirmationItemUpdateNav(pageProxy);
    }

    ServiceConfirmationLibrary.getInstance().resetAllFlags();
    return ServiceConfirmationLibrary.getInstance().openStartPage(pageProxy);
}
