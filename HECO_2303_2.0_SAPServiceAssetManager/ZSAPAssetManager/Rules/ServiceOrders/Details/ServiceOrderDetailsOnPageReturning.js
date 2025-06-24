import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';
import ProgressTrackerOnDataChanged from '../../TimelineControl/ProgressTrackerOnDataChanged';
import ServiceOrderDetailsToolbarVisibility from './ServiceOrderDetailsToolbarVisibility';

export default function ServiceOrderDetailsOnPageReturning(context) {
    return ToolbarRefresh(context).then(() => {
        return ServiceOrderDetailsToolbarVisibility(context).then(visibility => {
            context.getToolbar().setVisible(visibility);
            return ProgressTrackerOnDataChanged(context);
        });
    });
}
