import WorkOrderCompleted from '../../Details/WorkOrderDetailsOnPageLoad';
import libCom from '../../../Common/Library/CommonLibrary';
import Logger from '../../../Log/Logger';
import WorkOrderOperationDetailsToolbarVisibility from './WorkOrderOperationDetailsToolbarVisibility';

export default function WorkOrderOperationDetailsOnPageLoad(pageClientAPI) {
    libCom.removeStateVariable(pageClientAPI,'IgnoreToolbarUpdate');

    // handle the action bar items visiblity based on Work Order status
    return WorkOrderCompleted(pageClientAPI).then(() => {
        return WorkOrderOperationDetailsToolbarVisibility(pageClientAPI).then((visibility) => {
            let toolbar = pageClientAPI.getToolbar();
            if (toolbar) {
                try {
                    toolbar.setVisible(visibility);
                } catch (error) {
                    Logger.error('Toolbar visibility', error);
                }
            }
        });
    });
}
