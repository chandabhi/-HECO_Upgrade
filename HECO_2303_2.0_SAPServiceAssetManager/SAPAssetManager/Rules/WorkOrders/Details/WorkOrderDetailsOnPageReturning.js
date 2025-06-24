import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import Logger from '../../Log/Logger';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import WorkOrderDetailsToolbarVisibility from './WorkOrderDetailsToolbarVisibility';

export default function WorkOrderDetailsOnPageReturning(context) {
    return ToolbarRefresh(context).then(() => {
        return WorkOrderDetailsToolbarVisibility(context).then(visibility => {
            try {
                context.getToolbar().setVisible(visibility);
            } catch (error) {
                Logger.error('Toolbar visibility', error);
            }
            return ProgressTrackerOnDataChanged(context).then(() => {
                return context.redraw();
            });
        });
    });
}
