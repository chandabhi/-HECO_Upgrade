import ProgressTrackerOnDataChanged from '../../../TimelineControl/ProgressTrackerOnDataChanged';

export default function OperationalItemDetailsOnCustomEventDataReceived(context) {
    const { Data, EventType } = context.getAppEventData();
    if (EventType === 'RedrawOperationalItemDetailsPage' && Data) {
        ProgressTrackerOnDataChanged(context);
        context.getControl('SectionedTable').redraw();
        context.getToolbar().redraw();
    }
}
