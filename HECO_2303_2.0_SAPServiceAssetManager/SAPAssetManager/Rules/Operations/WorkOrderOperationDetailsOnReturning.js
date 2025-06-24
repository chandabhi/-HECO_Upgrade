import progressTrackerUpdate from '../TimelineControl/ProgressTrackerOnDataChanged';
import ToolbarRefresh from '../Common/DetailsPageToolbar/ToolbarRefresh';
import WorkOrderOperationDetailsToolbarVisibility from '../WorkOrders/Operations/Details/WorkOrderOperationDetailsToolbarVisibility';
import Logger from '../Log/Logger';

export default function WorkOrderOperationDetailsOnReturning(context) {
    return ToolbarRefresh(context).then(() => {
        return WorkOrderOperationDetailsToolbarVisibility(context).then(visibility => {
            try {
                context.getToolbar().setVisible(visibility);
            } catch (error) {
                Logger.error('Toolbar visibility', error);
            }
            return progressTrackerUpdate(context).then(() => {
                return context.redraw();
            });
        });
    });
}
