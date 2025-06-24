import ToolbarRefresh from '../Common/DetailsPageToolbar/ToolbarRefresh';
import ProgressTrackerOnDataChanged from '../TimelineControl/ProgressTrackerOnDataChanged';
import SubOperationDetailsToolbarVisibility from './SubOperationDetailsToolbarVisibility';

export default function SubOperationOnPageReturning(context) {
    return ToolbarRefresh(context).then(() => {
        return SubOperationDetailsToolbarVisibility(context).then(visibility => {
            context.getToolbar().setVisible(visibility);
            return ProgressTrackerOnDataChanged(context);
        });
    });
}
